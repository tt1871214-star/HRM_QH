from extensions import db

class User(db.Model):
    __bind_key__ = "mysql"   # dùng MySQL

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    password = db.Column(db.String(100))
    role = db.Column(db.String(20))  # admin / user
