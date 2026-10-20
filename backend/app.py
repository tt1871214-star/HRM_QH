import os
from flask import Flask, jsonify
from config import Config
from extensions import db, socketio, jwt
from routes.auth import auth_bp
from routes.employee import employee_bp
from routes.payroll import payroll_bp
from routes.notification import notification_bp
from routes.department import department_bp
from routes.position import position_bp
from routes.attendance import attendance_bp # Đã import
from routes.document import document_bp  # Đã import blueprint cho tài liệu
from flask_cors import CORS
from sqlalchemy.orm import joinedload
from models.employee import Employee  
from models.payroll import Salary
from models.attendance import Attendance
from routes.reports import report_bp


app = Flask(__name__)
app.config.from_object(Config)
app.config['JSON_AS_ASCII'] = False  # Đảm bảo JSON trả về không bị mã hóa Unicode

# Đảm bảo bind key "mssql" khớp với __bind_key__ trong models
app.config["SQLALCHEMY_BINDS"] = {
    "mssql": Config.SQL_SERVER_CONN,
    "mysql": Config.MYSQL_CONN
}

db.init_app(app)
jwt.init_app(app)
socketio.init_app(app)
CORS(app, 
     resources={r"/*": {"origins": "*"}}, 
     allow_headers="*", 
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# ==========================================
# ĐĂNG KÝ BLUEPRINT (Chỉ cần cái này là đủ)
# ==========================================
app.register_blueprint(auth_bp)
app.register_blueprint(employee_bp)
app.register_blueprint(payroll_bp)
app.register_blueprint(notification_bp)
app.register_blueprint(department_bp)
app.register_blueprint(position_bp)
app.register_blueprint(attendance_bp)
app.register_blueprint(report_bp)
app.register_blueprint(document_bp)  # Đăng ký blueprint cho tài liệu
@app.route("/")
def home():
    return {"msg": "API is running on port 5000"}

# Route lấy danh sách nhân viên có JOIN tên phòng ban và chức vụ
@app.route('/employee', methods=['GET'])
def get_employees_all():
    try:
        employee = Employee.query.options(
            joinedload(Employee.dept_rel), 
            joinedload(Employee.pos_rel)
        ).all()
        
        print(f"--- Debug: Đã lấy được {len(employee)} nhân viên từ Database ---")
        return jsonify([emp.to_dict() for emp in employee])
    except Exception as e:
        print(f"Lỗi truy vấn SQL: {e}")
        return jsonify({"error": str(e)}), 500

# ==========================================
# KHỞI CHẠY SERVER (Luôn phải nằm ở DƯỚI CÙNG)
# ==========================================
if __name__ == "__main__":
    # Đã xóa bỏ các route /payroll và /attendance dư thừa ở đây 
    # vì chúng đã được xử lý gọn gàng bên trong các file routes/payroll.py và routes/attendance.py
    socketio.run(app, port=5000, debug=True)