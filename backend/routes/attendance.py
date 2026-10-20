from flask import Blueprint, jsonify, request
from extensions import db
from datetime import datetime

from models.attendance import Attendance
from models.employee import Employee

attendance_bp = Blueprint(
    "attendance",
    __name__,
    url_prefix="/attendance"
)

# =====================================================
# GET ALL ATTENDANCE
# =====================================================
@attendance_bp.route("/", methods=["GET"])
def get_all_attendance():
    try:
        attendances = Attendance.query.all()
        employees = Employee.query.all()

        # MAP EMPLOYEE NAME
        emp_map = {}

        for e in employees:
            name = getattr(
                e,
                "FullName",
                getattr(e, "name", "N/A")
            )

            emp_map[e.id] = name

        result = []

        for a in attendances:
            data = a.to_dict()

            data["employee_name"] = emp_map.get(
                a.EmployeeID,
                "N/A"
            )

            result.append(data)

        return jsonify(result), 200

    except Exception as e:
        print("GET ATTENDANCE ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


# =====================================================
# CREATE ATTENDANCE
# =====================================================
@attendance_bp.route("/", methods=["POST"])
def create_attendance():
    try:
        data = request.get_json() or {}

        # GET DATA
        emp_id = (
            data.get("employee_id")
            or data.get("EmployeeID")
        )

        month_str = (
            data.get("attendance_month")
            or data.get("AttendanceMonth")
        )

        # VALIDATION
        if not emp_id or not month_str:
            return jsonify({
                "error": "Missing EmployeeID or AttendanceMonth"
            }), 400

        # FORMAT MONTH
        if len(month_str) == 7:
            month_str += "-01"

        month_date = datetime.strptime(
            month_str,
            "%Y-%m-%d"
        ).date()

        # CREATE RECORD
        new_record = Attendance(
            EmployeeID=emp_id,
            AttendanceMonth=month_date,

            WorkDays=(
                data.get("work_days")
                or data.get("WorkDays")
                or 0
            ),

            AbsentDays=(
                data.get("absent_days")
                or data.get("AbsentDays")
                or 0
            ),

            LeaveDays=(
                data.get("leave_days")
                or data.get("LeaveDays")
                or 0
            )
        )

        db.session.add(new_record)

        db.session.commit()

        return jsonify({
            "message": "Attendance created successfully"
        }), 201

    except Exception as e:
        db.session.rollback()

        print("CREATE ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


# =====================================================
# UPDATE ATTENDANCE
# =====================================================
@attendance_bp.route("/<int:attendance_id>", methods=["PUT"])
def update_attendance(attendance_id):
    try:
        attendance = Attendance.query.get(attendance_id)

        if not attendance:
            return jsonify({
                "error": "Attendance not found"
            }), 404

        data = request.get_json() or {}

        # EMPLOYEE
        attendance.EmployeeID = (
            data.get("employee_id")
            or data.get("EmployeeID")
            or attendance.EmployeeID
        )

        # MONTH
        month_str = (
            data.get("attendance_month")
            or data.get("AttendanceMonth")
        )

        if month_str:

            if len(month_str) == 7:
                month_str += "-01"

            attendance.AttendanceMonth = datetime.strptime(
                month_str,
                "%Y-%m-%d"
            ).date()

        # WORK DAYS
        attendance.WorkDays = (
            data.get("work_days")
            or data.get("WorkDays")
            or 0
        )

        # ABSENT DAYS
        attendance.AbsentDays = (
            data.get("absent_days")
            or data.get("AbsentDays")
            or 0
        )

        # LEAVE DAYS
        attendance.LeaveDays = (
            data.get("leave_days")
            or data.get("LeaveDays")
            or 0
        )

        db.session.commit()

        return jsonify({
            "message": "Attendance updated successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        print("UPDATE ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


# =====================================================
# DELETE ATTENDANCE
# =====================================================
@attendance_bp.route("/<int:attendance_id>", methods=["DELETE"])
def delete_attendance(attendance_id):
    try:
        attendance = Attendance.query.get(attendance_id)

        if not attendance:
            return jsonify({
                "error": "Attendance not found"
            }), 404

        db.session.delete(attendance)

        db.session.commit()

        return jsonify({
            "message": "Attendance deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        print("DELETE ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500