from flask import Blueprint, jsonify
from extensions import db
from models.employee import Employee
from models.attendance import Attendance
from models.payroll import Salary
from sqlalchemy import extract
from datetime import datetime, timedelta

notification_bp = Blueprint("notification", __name__, url_prefix="/notifications")

@notification_bp.route("/", methods=["GET"])
def get_notifications():
    try:
        today = datetime.now()
        notifications = []

        # 1. THÔNG BÁO SINH NHẬT (Lấy từ Employee Model)
        # Quét nhân viên có ngày sinh nhật là hôm nay
        employees_birthday = Employee.query.filter(
            extract("month", Employee.dob) == today.month,
            extract("day", Employee.dob) == today.day
        ).all()

        for emp in employees_birthday:
            notifications.append({
                "id": f"bday-{emp.id}",
                "type": "birthday",
                "title": "Sinh nhật hôm nay",
                "msg": f"Chúc mừng sinh nhật {emp.name}! Đừng quên gửi lời chúc nhé. 🎉",
                "time": "Hôm nay",
                "isRead": False
            })

        # 2. THÔNG BÁO NGHỈ QUÁ NHIỀU (Dựa trên Attendance trong tháng hiện tại)
        # Ví dụ: Ai nghỉ từ 3 ngày trở lên trong tháng
        bad_attendance = Attendance.query.filter(
            extract("month", Attendance.AttendanceMonth) == today.month,
            Attendance.AbsentDays >= 3
        ).all()

        # Cần map tên nhân viên (giống cách bạn làm ở Report)
        employees = Employee.query.all()
        emp_map = {e.id: e.name for e in employees}

        for att in bad_attendance:
            notifications.append({
                "id": f"absent-{att.id}",
                "type": "contract", # Sử dụng type contract để hiện màu đỏ cảnh báo
                "title": "Cảnh báo chuyên cần",
                "msg": f"Nhân viên {emp_map.get(att.EmployeeID, 'N/A')} đã nghỉ {att.AbsentDays} ngày trong tháng này.",
                "time": "Cập nhật mới",
                "isRead": False
            })

        # 3. THÔNG BÁO PHÊ DUYỆT LƯƠNG (Dựa trên Salary Model)
        # Lấy các bản ghi lương mới nhất vừa được thêm trong tháng
        recent_salaries = Salary.query.filter(
            extract("month", Salary.SalaryMonth) == today.month
        ).limit(1).all()

        if recent_salaries:
            notifications.append({
                "id": "salary-release",
                "type": "system",
                "title": "Bảng lương tháng này",
                "msg": f"Dữ liệu lương tháng {today.month} đã được cập nhật lên hệ thống.",
                "time": "Vừa xong",
                "isRead": True
            })

        return jsonify(notifications)

    except Exception as e:
        print("NOTIFICATION ERROR:", e)
        return jsonify({"error": str(e)}), 500