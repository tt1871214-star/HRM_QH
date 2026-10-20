from extensions import db

from datetime import datetime

from sqlalchemy import Numeric


class Salary(db.Model):

    # =====================================================
    # MYSQL TABLE
    # =====================================================

    __tablename__ = "salaries"

    SalaryID = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )

    EmployeeID = db.Column(
        db.Integer,
        nullable=False
    )

    SalaryMonth = db.Column(
        db.Date,
        nullable=False
    )

    BaseSalary = db.Column(
        "BaseSalary",
        Numeric(12, 2),
        default=0
    )

    Bonus = db.Column(
        "Bonus",
        Numeric(12, 2),
        default=0
    )

    Deductions = db.Column(
        "Deductions",
        Numeric(12, 2),
        default=0
    )

    NetSalary = db.Column(
        "NetSalary",
        Numeric(12, 2),
        default=0
    )

    CreatedAt = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    # =====================================================
    # TO DICT
    # =====================================================

    def to_dict(self, employee_name=None):

        return {

            "id": self.SalaryID,

            "employee_id": self.EmployeeID,

            "employee_name": employee_name,

            "salary_month": (
                str(self.SalaryMonth)
                if self.SalaryMonth else None
            ),

            "base_salary": float(
                self.BaseSalary or 0
            ),

            "bonus": float(
                self.Bonus or 0
            ),

            "deductions": float(
                self.Deductions or 0
            ),

            "net_salary": float(
                self.NetSalary or 0
            ),

            "created_at": (
                str(self.CreatedAt)
                if self.CreatedAt else None
            )
        }