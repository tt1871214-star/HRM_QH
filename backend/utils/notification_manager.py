from models.notification import Notification
from extensions import db, socketio
from datetime import datetime

# Simple cache for unread count (TTL: 10 seconds)
# Lưu ý: Trong môi trường multi-worker (như Gunicorn), 
# cache global này sẽ không đồng bộ giữa các process.
_cache = {"count": 0, "time": 0}
CACHE_TTL = 10

class NotificationManager:
    """Quản lý thông báo tập trung, hỗ trợ broadcast Real-time"""
    
    @staticmethod
    def create(message, notification_type="Info", event_type=None, 
               source_module=None, user_id=None, related_id=None, action_url=None):
        """Tạo thông báo mới và gửi qua SocketIO"""
        noti = Notification(
            message=message,
            type=notification_type,
            event_type=event_type,
            source_module=source_module,
            user_id=user_id,
            related_id=related_id,
            action_url=action_url
        )
        db.session.add(noti)
        db.session.commit()
        
        # Broadcast cho client (nên dùng room nếu có user_id)
        room = f"user_{user_id}" if user_id else None
        socketio.emit("notification:new", noti.to_dict(), to=room, broadcast=(not room))
        
        # Invalidate cache
        _cache["time"] = 0
        
        return noti
    
    @staticmethod
    def mark_as_read(noti_id):
        """Đánh dấu một thông báo đã đọc"""
        noti = Notification.query.get(noti_id)
        if noti and not noti.is_read:
            noti.is_read = True
            noti.read_at = datetime.utcnow()
            db.session.commit()
            
            socketio.emit("notification:update", noti.to_dict(), broadcast=True)
            _cache["time"] = 0
        return noti
    
    @staticmethod
    def get_unread_count(user_id=None):
        """Get unread count with caching"""
        now = datetime.utcnow().timestamp()
        if now - _cache["time"] > CACHE_TTL:
            query = Notification.query.filter_by(is_read=False)
            if user_id:
                query = query.filter_by(user_id=user_id)
            _cache["count"] = query.count()
            _cache["time"] = now
        return _cache["count"]
    
    @staticmethod
    def mark_all_as_read(user_id=None):
        """Mark all notifications as read for a user"""
        query = Notification.query.filter_by(is_read=False)
        if user_id:
            query = query.filter_by(user_id=user_id)
        query.update({"is_read": True, "read_at": datetime.utcnow()})
        db.session.commit()
        socketio.emit("notification:all_read", {"user_id": user_id}, broadcast=True)
        _cache["time"] = 0
    
    @staticmethod
    def delete(noti_id):
        """Delete a notification"""
        noti = Notification.query.get(noti_id)
        if noti:
            db.session.delete(noti)
            db.session.commit()
            socketio.emit("notification:deleted", {"id": noti_id}, broadcast=True)
            _cache["time"] = 0
        return noti
    
    @staticmethod
    def purge_read(user_id=None):
        """Delete all read notifications"""
        query = Notification.query.filter_by(is_read=True)
        if user_id:
            query = query.filter_by(user_id=user_id)
        query.delete()
        db.session.commit()
        socketio.emit("notification:purge", {"user_id": user_id}, broadcast=True)
        _cache["time"] = 0