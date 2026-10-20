from flask import Blueprint, jsonify, request
from extensions import db
from models.payroll import Salary
from models.employee import Employee
from models.attendance import Attendance
from sqlalchemy import extract

report_bp = Blueprint("report", __name__, url_prefix="/report")


# ================= GET REPORT =================
@report_bp.route("/", methods=["GET"])
def get_report():
    try:
        month = request.args.get("month")

        # ===== GET DATA =====
        salaries = Salary.query
        attendances = Attendance.query
        employees = Employee.query.all()

        # map employee name
        emp_map = {e.id: e.name for e in employees}

        # ===== FILTER MONTH =====
        if month:
            year, mon = map(int, month.split("-"))

            salaries = salaries.filter(
                extract("year", Salary.SalaryMonth) == year,
                extract("month", Salary.SalaryMonth) == mon
            )

            attendances = attendances.filter(
                extract("year", Attendance.AttendanceMonth) == year,
                extract("month", Attendance.AttendanceMonth) == mon
            )

        salaries = salaries.all()
        attendances = attendances.all()

        # ===== TOTAL =====
        total_employees = len(employees)
        total_salary = sum(float(s.NetSalary or 0) for s in salaries)

        # ===== TOP SALARY =====
        top = sorted(salaries, key=lambda x: x.NetSalary or 0, reverse=True)[:5]

        top_data = [
            {
                "employee_id": s.EmployeeID,
                "employee_name": emp_map.get(s.EmployeeID, "N/A"),
                "salary": float(s.NetSalary or 0),
                "month": str(s.SalaryMonth)[:7] if s.SalaryMonth else None
            }
            for s in top
        ]

        # ===== ATTENDANCE =====
        attendance_data = [
            {
                "employee_id": a.EmployeeID,
                "employee_name": emp_map.get(a.EmployeeID, "N/A"),
                "month": str(a.AttendanceMonth)[:7] if a.AttendanceMonth else None,
                "work_days": a.WorkDays,
                "absent_days": a.AbsentDays,
                "leave_days": a.LeaveDays
            }
            for a in attendances
        ]

        present = sum(a.WorkDays or 0 for a in attendances)
        absent = sum(a.AbsentDays or 0 for a in attendances)
        leave = sum(a.LeaveDays or 0 for a in attendances)

        # ===== RESPONSE =====
        return jsonify({
            "total_employees": total_employees,
            "total_salary": total_salary,
            "top_salary": top_data,
            "attendance_summary": {
                "present": present,
                "absent": absent,
                "leave": leave
            },
            "attendance": attendance_data
        })

    except Exception as e:
        print("REPORT ERROR:", e)
        return jsonify({"error": str(e)}), 500