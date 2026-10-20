from extensions import db

class Notification(db.Model):
    __bind_key__ = "mysql"

    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(255))
    type = db.Column(db.String(50))
    is_read = db.Column(db.Boolean, default=False)