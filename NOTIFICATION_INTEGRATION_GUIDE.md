# Notification System Integration Guide

## 📢 Enhanced Notification System Features

✔ **Event Notifications** - Real-time event-driven system
✔ **Real-time Updates** - Socket.io powered live updates
✔ **Module Connections** - Integrated with all major modules
✔ **Improved UX** - Modern UI with animations and categorization

---

## 🚀 Backend Integration (Python/Flask)

### How to Trigger Notifications from Any Module

Import the NotificationManager and NotificationEvents:

```python
from utils.notification_manager import NotificationManager, NotificationEvents
```

### Option 1: Use Pre-defined Events

```python
# Employee Module
from utils.notification_manager import NotificationEvents

# In your employee creation route
NotificationEvents.employee_added("John Doe")

# Payroll Module
NotificationEvents.payroll_processed("May 2024")

# Attendance Module
NotificationEvents.attendance_marked("John Doe", "2024-05-09")

# Documents Module
NotificationEvents.document_uploaded("Q1_Report.pdf")

# Security/Permissions
NotificationEvents.permission_changed("John Doe", "Manager")

# Error/Alert
NotificationEvents.error_alert("Failed to process payroll for May")
```

### Option 2: Custom Notifications

```python
from utils.notification_manager import NotificationManager

# Create custom notification
NotificationManager.create(
    message="Custom notification message",
    notification_type="Info",        # Info, Warning, Alert, Success
    event_type="custom_event",       # Custom event identifier
    source_module="employee",        # Module name
    user_id=123,                     # Optional: target user
    related_id=456,                  # Optional: related entity ID
    action_url="/employee/456"       # Optional: URL to navigate
)
```

### Integration Examples for Each Module

#### 1. **Employee Module** (`routes/employee.py`)

```python
from utils.notification_manager import NotificationEvents

@employee_bp.route("/employees", methods=["POST"])
def create_employee():
    # ... create employee logic ...
    
    # Trigger notification
    NotificationEvents.employee_added(new_employee.name)
    
    return jsonify({"message": "Employee created"}), 201

@employee_bp.route("/employees/<int:id>", methods=["DELETE"])
def delete_employee(id):
    # ... delete logic ...
    
    NotificationManager.create(
        message=f"Employee {employee.name} has been deleted",
        notification_type="Warning",
        event_type="employee_deleted",
        source_module="employee"
    )
```

#### 2. **Payroll Module** (`routes/payroll.py`)

```python
from utils.notification_manager import NotificationEvents, NotificationManager

@payroll_bp.route("/payroll/process", methods=["POST"])
def process_payroll():
    # ... process payroll logic ...
    
    NotificationEvents.payroll_processed("May 2024")
    
    # Or detailed custom notification
    NotificationManager.create(
        message=f"💰 Payroll processed: {employee_count} employees",
        notification_type="Success",
        event_type="payroll_processed",
        source_module="payroll",
        action_url="/payroll"
    )
```

#### 3. **Attendance Module** (`routes/attendance.py`)

```python
from utils.notification_manager import NotificationEvents

@attendance_bp.route("/attendance", methods=["POST"])
def mark_attendance():
    # ... attendance logic ...
    
    NotificationEvents.attendance_marked(employee.name, attendance.date)
```

#### 4. **Documents Module** (`routes/document.py`)

```python
from utils.notification_manager import NotificationEvents

@document_bp.route("/documents", methods=["POST"])
def upload_document():
    # ... upload logic ...
    
    NotificationEvents.document_uploaded(file.filename)
```

---

## 🎨 Frontend Integration

### Using the Notification Bell Component

The `NotificationBell.jsx` component automatically handles:
- Real-time notifications via Socket.io
- Module filtering (payroll, attendance, documents, etc.)
- Mark as read/Delete actions
- Unread count badge

Just add it to your Header:

```jsx
import NotificationBell from "../components/NotificationBell";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      {/* ... other header items ... */}
      <NotificationBell />
    </header>
  );
}
```

### Using the Notifications Page

Users can access full notification management at `/notifications` route with:
- Search & filtering
- Module-based categorization
- Mark all as read
- Purge read notifications
- Action buttons (mark read, delete)

### Creating Custom Notifications from Frontend

```javascript
import { notificationService } from "../services/notificationService";

// Create notification
await notificationService.create({
  message: "Your custom message",
  type: "Info",           // Info, Warning, Alert, Success
  source_module: "payroll",
  event_type: "custom_event",
  action_url: "/payroll"
});

// Mark as read
await notificationService.markRead(notificationId);

// Mark all as read
await notificationService.markAllRead();

// Delete notification
await notificationService.delete(notificationId);

// Get unread count
const response = await notificationService.getUnreadCount();
console.log(response.data.unread_count);

// Get by module
const response = await notificationService.getByModule("payroll");
```

---

## 📊 Database Model

```python
Notification:
  - id (Integer, PK)
  - message (String) - Main notification text
  - type (String) - Info, Warning, Alert, Success
  - event_type (String) - Specific event identifier
  - source_module (String) - Module: payroll, attendance, documents, employee, security, system
  - user_id (Integer) - Target user
  - related_id (Integer) - Related entity ID
  - action_url (String) - Navigation URL
  - is_read (Boolean)
  - read_at (DateTime)
  - created_at (DateTime)
  - updated_at (DateTime)
```

---

## 🔌 Socket.io Events

Real-time events emitted to all connected clients:

```javascript
// New notification created
socket.on("new_notification", (notification) => {
  // Add to list
});

// Notification marked as read
socket.on("notification_read", ({ id }) => {
  // Update UI
});

// All notifications marked as read
socket.on("notifications_read_all", () => {
  // Update all to read
});

// Notification deleted
socket.on("notification_deleted", ({ id }) => {
  // Remove from list
});

// All read notifications deleted
socket.on("notifications_purged", () => {
  // Refresh list
});
```

---

## 📱 Available Module Icons

```
💰 - payroll
✅ - attendance
📄 - documents
👤 - employee
🔐 - security
⚙️ - system
📢 - default
```

---

## 🎯 Quick Setup Checklist

- [ ] Enhance Notification model with new fields
- [ ] Create NotificationManager service
- [ ] Update notification routes
- [ ] Update notificationService.js on frontend
- [ ] Add NotificationBell to Header component
- [ ] Add NotificationToast component
- [ ] Integrate with Employee module
- [ ] Integrate with Payroll module
- [ ] Integrate with Attendance module
- [ ] Integrate with Documents module
- [ ] Add animations to CSS
- [ ] Test Socket.io real-time updates
- [ ] Set up error handling
- [ ] Configure action URLs for each module

---

## 🔧 Configuration & Customization

### Update Module Icons
Edit `MODULE_ICONS` in both `NotificationBell.jsx` and `Notifications.jsx`:

```javascript
const MODULE_ICONS = {
  payroll: "💰",
  attendance: "✅",
  documents: "📄",
  employee: "👤",
  security: "🔐",
  system: "⚙️",
  // Add more as needed
};
```

### Customize Badge Colors
Edit `getBadgeColor()` function in `Notifications.jsx`

### Adjust Notification Retention
Edit toast timeout in `NotificationToast.jsx` (currently 4000ms)

---

## 🐛 Troubleshooting

**Notifications not appearing in real-time?**
- Check Socket.io connection status
- Verify `socketio.emit()` calls in backend
- Check browser console for errors

**API endpoints returning errors?**
- Ensure notification routes are registered in `app.py`
- Check database migrations for new fields
- Verify NotificationManager import paths

**UI not showing correctly?**
- Clear browser cache
- Verify Tailwind CSS is imported
- Check for CSS animation definitions in `index.css`

---

## 📚 API Reference

### GET /notifications
Get all notifications with pagination and filters
```
?page=1&per_page=50&module=payroll&unread=false
```

### GET /notifications/unread/count
Get count of unread notifications

### POST /notifications
Create new notification

### PUT /notifications/{id}/read
Mark specific notification as read

### PUT /notifications/read/all
Mark all notifications as read

### DELETE /notifications/{id}
Delete specific notification

### DELETE /notifications/read/purge
Delete all read notifications

### GET /notifications/module/{module_name}
Get notifications from specific module
