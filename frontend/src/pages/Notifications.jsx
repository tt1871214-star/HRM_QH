import React, { useState, useEffect } from 'react';
import { 
  Bell, Cake, FileUp, AlertCircle, 
  CalendarClock, CheckCircle2, Loader2 
} from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/notifications/");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'birthday': return { icon: <Cake size={20} />, color: 'bg-pink-100 text-pink-600' };
      case 'leave_request': return { icon: <CalendarClock size={20} />, color: 'bg-amber-100 text-amber-600' };
      case 'update': return { icon: <FileUp size={20} />, color: 'bg-blue-100 text-blue-600' };
      case 'contract': return { icon: <AlertCircle size={20} />, color: 'bg-rose-100 text-rose-600' };
      default: return { icon: <CheckCircle2 size={20} />, color: 'bg-green-100 text-green-600' };
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg">
              <Bell size={24} />
            </div>
            Trung tâm thông báo
          </h2>
          <p className="text-slate-500 mt-1 ml-12">Dữ liệu được cập nhật thực tế từ hệ thống nhân sự</p>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center">
            <p className="text-slate-400 font-medium">Hiện tại chưa có thông báo nào mới.</p>
          </div>
        ) : (
          notifications.map((item) => {
            const style = renderIcon(item.type);
            return (
              <div 
                key={item.id} 
                className={`group bg-white p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 hover:shadow-md 
                  ${item.isRead ? 'border-slate-100 opacity-75' : 'border-blue-200 shadow-sm bg-blue-50/10'}`}
              >
                <div className={`p-3 rounded-xl shrink-0 ${style.color} group-hover:scale-110 transition-transform`}>
                  {style.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-tighter">{item.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{item.msg}</p>
                </div>
                {!item.isRead && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  );
}