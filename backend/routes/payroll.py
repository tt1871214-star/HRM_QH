from flask import Blueprint
from flask import jsonify
from flask import request

from datetime import datetime

from extensions import db

from models.payroll import Salary
from models.employee import Employee


# =====================================================
# BLUEPRINT
# =====================================================

payroll_bp = Blueprint(
    "payroll",
    __name__,
    url_prefix="/payroll"
)


# =====================================================
# GET ALL PAYROLL
# =====================================================

@payroll_bp.route("/", methods=["GET"])
def get_all_payroll():

    try:

        payrolls = Salary.query.all()

        employees = Employee.query.all()

        # MAP EMPLOYEE ID -> NAME
        emp_map = {
            e.id: e.name
            for e in employees
        }

        result = []

        for p in payrolls:

            data = p.to_dict(
                employee_name=emp_map.get(
                    p.EmployeeID,
                    "N/A"
                )
            )

            result.append(data)

        return jsonify(result), 200

    except Exception as e:

        print("GET PAYROLL ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


# =====================================================
# CREATE PAYROLL
# =====================================================

@payroll_bp.route("/", methods=["POST"])
def create_payroll():

    try:

        data = request.get_json()

        print("DATA RECEIVED =", data)

        if not data:

            return jsonify({
                "error": "No data received"
            }), 400

        # =================================================
        # GET DATA
        # =================================================

        employee_id = data.get("employee_id")

        salary_month = data.get("salary_month")

        base_salary = data.get("base_salary")

        bonus = float(
            data.get("bonus", 0)
        )

        deductions = float(
            data.get("deductions", 0)
        )

        # =================================================
        # VALIDATION
        # =================================================

        if not employee_id:

            return jsonify({
                "error": "employee_id missing"
            }), 400

        if not salary_month:

            return jsonify({
                "error": "salary_month missing"
            }), 400

        if base_salary is None:

            return jsonify({
                "error": "base_salary missing"
            }), 400

        # =================================================
        # FORMAT DATE
        # =================================================

        if len(salary_month) == 7:
            salary_month += "-01"

        salary_month = datetime.strptime(
            salary_month,
            "%Y-%m-%d"
        ).date()

        # =================================================
        # CHECK DUPLICATE
        # =================================================

        existing = Salary.query.filter_by(
            EmployeeID=int(employee_id),
            SalaryMonth=salary_month
        ).first()

        if existing:

            return jsonify({
                "error": "Payroll already exists"
            }), 400

        # =================================================
        # CALCULATE NET
        # =================================================

        net_salary = (
            float(base_salary)
            + bonus
            - deductions
        )

        # =================================================
        # CREATE OBJECT
        # =================================================

        payroll = Salary(

            EmployeeID=int(employee_id),

            SalaryMonth=salary_month,

            BaseSalary=float(base_salary),

            Bonus=bonus,

            Deductions=deductions,

            NetSalary=net_salary
        )

        db.session.add(payroll)

        db.session.commit()

        employee = Employee.query.filter_by(
            id=employee_id
        ).first()

        employee_name = (
            employee.name
            if employee else "N/A"
        )

        return jsonify({

            "message": "Payroll created successfully",

            "data": payroll.to_dict(
                employee_name=employee_name
            )

        }), 201

    except Exception as e:

        db.session.rollback()

        print("CREATE PAYROLL ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


# =====================================================
# UPDATE PAYROLL
# =====================================================

@payroll_bp.route("/<int:salary_id>", methods=["PUT"])
def update_payroll(salary_id):

    try:

        salary = Salary.query.get(salary_id)

        if not salary:

            return jsonify({
                "error": "Payroll not found"
            }), 404

        data = request.get_json()

        print("UPDATE DATA =", data)

        # =================================================
        # UPDATE EMPLOYEE
        # =================================================

        salary.EmployeeID = int(
            data.get(
                "employee_id",
                salary.EmployeeID
            )
        )

        # =================================================
        # UPDATE MONTH
        # =================================================

        month_str = data.get("salary_month")

        if month_str:

            if len(month_str) == 7:
                month_str += "-01"

            salary.SalaryMonth = (
                datetime.strptime(
                    month_str,
                    "%Y-%m-%d"
                ).date()
            )

        # =================================================
        # UPDATE SALARY
        # =================================================

        salary.BaseSalary = float(
            data.get(
                "base_salary",
                salary.BaseSalary
            )
        )

        salary.Bonus = float(
            data.get(
                "bonus",
                salary.Bonus
            )
        )

        salary.Deductions = float(
            data.get(
                "deductions",
                salary.Deductions
            )
        )

        salary.NetSalary = (
            salary.BaseSalary
            + salary.Bonus
            - salary.Deductions
        )

        db.session.commit()

        employee = Employee.query.filter_by(
            id=salary.EmployeeID
        ).first()

        employee_name = (
            employee.name
            if employee else "N/A"
        )

        return jsonify({

            "message": "Payroll updated successfully",

            "data": salary.to_dict(
                employee_name=employee_name
            )

        }), 200

    except Exception as e:

        db.session.rollback()

        print("UPDATE PAYROLL ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


# =====================================================
# DELETE PAYROLL
# =====================================================

@payroll_bp.route("/<int:salary_id>", methods=["DELETE"])
def delete_payroll(salary_id):

    try:

        salary = Salary.query.get(salary_id)

        if not salary:

            return jsonify({
                "error": "Payroll not found"
            }), 404

        db.session.delete(salary)

        db.session.commit()

        return jsonify({
            "message": "Payroll deleted successfully"
        }), 200

    except Exception as e:

        db.session.rollback()

        print("DELETE PAYROLL ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500