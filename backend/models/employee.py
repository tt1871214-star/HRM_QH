from extensions import db

# =====================================================
# DEPARTMENT
# =====================================================
class Department(db.Model):
    __bind_key__ = "mssql"
    __tablename__ = 'Departments'

    id = db.Column("DepartmentID", db.Integer, primary_key=True)
    # Đổi sang NVARCHAR để hỗ trợ tiếng Việt có dấu
    name = db.Column("DepartmentName", db.NVARCHAR(100)) 


# =====================================================
# POSITION
# =====================================================
class Position(db.Model):
    __bind_key__ = "mssql"
    __tablename__ = 'Positions'

    id = db.Column("PositionID", db.Integer, primary_key=True)
    # Đổi sang NVARCHAR để hỗ trợ tiếng Việt có dấu
    name = db.Column("PositionName", db.NVARCHAR(100))


# =====================================================
# EMPLOYEE
# =====================================================
class Employee(db.Model):
    __bind_key__ = "mssql"
    __tablename__ = 'Employees'

    id = db.Column("EmployeeID", db.Integer, primary_key=True)
    
    # Sửa db.Nvarchar -> db.NVARCHAR
    name = db.Column("FullName", db.NVARCHAR(100))
    
    date_of_birth = db.Column("DateOfBirth", db.Date)
    
    # Giới tính: Đảm bảo SQL Server là NVARCHAR
    gen_der = db.Column("Gender", db.NVARCHAR(10)) 

    hire_date = db.Column("HireDate", db.Date)

    email = db.Column("Email", db.NVARCHAR(100), unique=True)

    phone = db.Column("PhoneNumber", db.NVARCHAR(15))

    status = db.Column("Status", db.NVARCHAR(50))

    # =====================================================
    # FOREIGN KEYS (Sửa lại tên bảng.cột cho đúng chuẩn)
    # =====================================================
    department_id = db.Column(
        "DepartmentID", 
        db.Integer, 
        db.ForeignKey('Departments.DepartmentID')
    )

    position_id = db.Column(
        "PositionID", 
        db.Integer, 
        db.ForeignKey('Positions.PositionID')
    )

    # =====================================================
    # RELATIONSHIPS
    # =====================================================
    dept_rel = db.relationship("Department", backref="employees")
    pos_rel = db.relationship("Position", backref="employees")

    # =====================================================
    # TO DICT
    # =====================================================
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "date_of_birth": (
                self.date_of_birth.strftime('%Y-%m-%d') # Format ngày cho đẹp
                if self.date_of_birth else None
            ),
            "hire_date": (
                self.hire_date.strftime('%Y-%m-%d') 
                if self.hire_date else None
            ),
            "gender": self.gen_der, # Lấy giới tính từ cột gen_der
            "email": self.email,
            "phone": self.phone,
            "status": self.status,
            
            # Thông tin phòng ban
            "department_id": self.department_id,
            "department": (
                self.dept_rel.name 
                if self.dept_rel else "Chưa xác định"
            ),

            # Thông tin chức vụ
            "position_id": self.position_id,
            "position": (
                self.pos_rel.name 
                if self.pos_rel else "Nhân viên"
            )
        }