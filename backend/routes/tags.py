from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..db import get_db

bp = Blueprint('tags', __name__)

@bp.route('/tags', methods=['GET'])
@jwt_required()
def get_tags():
    db = get_db()
    tags = db.execute('SELECT * FROM tag').fetchall()
    return jsonify([dict(row) for row in tags])

@bp.route('/tags', methods=['POST'])
@jwt_required()
def add_tag():
    data = request.get_json()
    name = data.get('name')
    color = data.get('color')
    if not name or not color:
        return jsonify({"error": "Name and color are required"}), 400

    db = get_db()
    cursor = db.execute('INSERT INTO tag (name, color) VALUES (?, ?)', (name, color))
    db.commit()
    tag_id = cursor.lastrowid
    new_tag = {"id": tag_id, "name": name, "color": color}
    return jsonify({"message": "Tag added successfully", "tag": new_tag}), 201

@bp.route('/tags/<int:id>', methods=['PUT'])
@jwt_required()
def update_tag(id):
    data = request.get_json()
    name = data.get('name')
    color = data.get('color')

    if not name or not color:
        return jsonify({"error": "Name and color are required"}), 400

    db = get_db()
    db.execute('UPDATE tag SET name = ?, color = ? WHERE id = ?', (name, color, id))
    db.commit()
    updated_tag = {"id": id, "name": name, "color": color}
    return jsonify({"message": "Tag updated successfully", "tag": updated_tag})

@bp.route('/tags/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_tag(id):
    db = get_db()
    db.execute('DELETE FROM tag WHERE id = ?', (id,))
    db.commit()
    return jsonify({"message": "Tag deleted successfully"})