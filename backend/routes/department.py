from flask import Blueprint, jsonify
from models.employee import Department

department_bp = Blueprint("department", __name__)

@department_bp.route("/departments", methods=["GET"])
def get_all_departments():
    try:
        departments = Department.query.all()
        return jsonify([{
            "id": dept.id,
            "name": dept.name
        } for dept in departments])
    except Exception as e:
        return jsonify({"error": str(e)}), 500