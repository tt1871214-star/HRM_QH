from flask import Blueprint, jsonify
from models.employee import Position

position_bp = Blueprint("position", __name__)

@position_bp.route("/positions", methods=["GET"])
def get_all_positions():
    try:
        positions = Position.query.all()
        return jsonify([{
            "id": pos.id,
            "name": pos.name
        } for pos in positions])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
