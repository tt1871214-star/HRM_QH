# =========================================================
# models/attendance.py
# MYSQL MODEL
# =========================================================

from extensions import db


class Attendance(db.Model):

    __tablename__ = "attendance"

    AttendanceID = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )

    # IMPORTANT:
    # NO FOREIGN KEY
    # BECAUSE Employee IS IN SQL SERVER
    EmployeeID = db.Column(
        db.Integer,
        nullable=False
    )

    AttendanceMonth = db.Column(
        db.Date,
        nullable=False
    )

    WorkDays = db.Column(
        db.Integer,
        default=0
    )

    AbsentDays = db.Column(
        db.Integer,
        default=0
    )

    LeaveDays = db.Column(
        db.Integer,
        default=0
    )

    # =====================================================
    # TO DICT
    # =====================================================

    def to_dict(self):

        return {
            "AttendanceID": self.AttendanceID,

            "EmployeeID": self.EmployeeID,

            "AttendanceMonth": (
                str(self.AttendanceMonth)
                if self.AttendanceMonth else None
            ),

            "WorkDays": self.WorkDays,

            "AbsentDays": self.AbsentDays,

            "LeaveDays": self.LeaveDays
        }