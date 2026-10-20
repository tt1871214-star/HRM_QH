from flask import Blueprint, request
from models.user import User
from extensions import db
from utils.jwt_helper import generate_token

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data["username"]).first()

    if not user or user.password != data["password"]:
        return {"msg": "Invalid"}, 401

    token = generate_token(user)

    return {"token": token}