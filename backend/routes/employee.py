from flask import Blueprint, jsonify, request
from extensions import db
from datetime import datetime
from sqlalchemy import func
from models.employee import Department, Employee, Position

employee_bp = Blueprint("employee", __name__)

def parse_date(date_str):
    if not date_str: return None
    try:
        # Hỗ trợ format YYYY-MM-DD từ frontend
        return datetime.strptime(date_str, '%Y-%m-%d')
    except:
        return None

@employee_bp.route("/employees", methods=["GET"])
def get_all():
    try:
        employees = Employee.query.all()
        return jsonify([e.to_dict() for e in employees])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@employee_bp.route("/employees", methods=["POST"])
def create_employee():
    try:
        data = request.get_json() or {}
        
        # 1. Tìm DepartmentID từ tên
        dept_id = data.get("department_id")
        if not dept_id and data.get("department"):
            dept = Department.query.filter(func.lower(Department.name) == data.get("department").lower().strip()).first()
            if dept: dept_id = dept.id

        # 2. Tìm PositionID từ tên
        pos_id = data.get("position_id")
        if not pos_id and data.get("position"):
            pos = Position.query.filter(func.lower(Position.name) == data.get("position").lower().strip()).first()
            if pos: pos_id = pos.id

        # 3. Tạo object Employee (Lưu ý: gen_der là tên biến trong Model của bạn)
        new_emp = Employee(
            name=data.get("name"),
            email=data.get("email"),
            phone=data.get("phone"),
            gen_der=data.get("gender"),  # FIX: Nhận giới tính từ JSON key "gender"
            status=data.get("status"),
            department_id=dept_id,
            position_id=pos_id,
            date_of_birth=parse_date(data.get("date_of_birth")),
            hire_date=parse_date(data.get("hire_date")) or datetime.now()
        )

        db.session.add(new_emp)
        db.session.commit()
        return jsonify(new_emp.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@employee_bp.route("/employees/<int:employee_id>", methods=["PUT", "PATCH"])
def update_employee(employee_id):
    try:
        emp = db.session.get(Employee, employee_id)
        if not emp:
            return jsonify({"error": "Không tìm thấy nhân viên"}), 404

        data = request.get_json() or {}
        
        # Cập nhật các trường cơ bản
        if "name" in data: emp.name = data["name"]
        if "status" in data: emp.status = data["status"]
        if "email" in data: emp.email = data["email"]
        if "phone" in data: emp.phone = data["phone"]
        if "gender" in data: emp.gen_der = data["gender"]  # FIX: Cập nhật giới tính
        
        # Cập nhật ngày tháng
        if "date_of_birth" in data:
            emp.date_of_birth = parse_date(data["date_of_birth"])
        
        # Cập nhật phòng ban/vị trí thông minh
        if "department" in data:
            dept = Department.query.filter(func.lower(Department.name) == data["department"].lower().strip()).first()
            if dept: emp.department_id = dept.id
            
        if "position" in data:
            pos = Position.query.filter(func.lower(Position.name) == data["position"].lower().strip()).first()
            if pos: emp.position_id = pos.id

        db.session.commit()
        return jsonify(emp.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@employee_bp.route("/employees/<int:employee_id>", methods=["DELETE"])
def delete_employee(employee_id):
    try:
        emp = db.session.get(Employee, employee_id)
        if emp:
            db.session.delete(emp)
            db.session.commit()
        return jsonify({"message": "Xóa thành công"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500