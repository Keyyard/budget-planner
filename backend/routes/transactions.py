from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..db import get_db
from datetime import datetime
bp = Blueprint('transactions', __name__)

@bp.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    try:
        current_user = get_jwt_identity()
        print(f"Current user: {current_user}")

        if isinstance(current_user, str):
            username = current_user
        else:
            return jsonify({"msg": "Invalid user data"}), 400

        db = get_db()
        user = db.execute('SELECT * FROM user WHERE username = ?', (username,)).fetchone()
        if user is None:
            return jsonify({"msg": "User not found"}), 404

        print(f"User ID: {user['id']}")  # Debugging statement

        transactions = db.execute('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC', (user['id'],)).fetchall()
        print(f"Transactions: {transactions}")  # Debugging statement

        return jsonify([dict(row) for row in transactions]), 200
    except Exception as e:
        print(f"An error occurred: {e}")  # Debugging statement
        return jsonify({"msg": f"An error occurred: {e}"}), 500

@bp.route('/transactions', methods=['POST'])
@jwt_required()
def add_transaction():
    try:
        current_user = get_jwt_identity()
        print(f"Current user: {current_user}")  # Debugging statement

        # Assuming current_user is a string (username)
        if isinstance(current_user, str):
            username = current_user
        else:
            return jsonify({"msg": "Invalid user data"}), 400

        data = request.get_json()
        if 'amount' not in data or 'tag_id' not in data:
            return jsonify({"msg": "Invalid data"}), 400

        db = get_db()
        user = db.execute('SELECT * FROM user WHERE username = ?', (username,)).fetchone()
        if user is None:
            return jsonify({"msg": "User not found"}), 404

        db.execute('INSERT INTO transactions (amount, tag_id, user_id, date) VALUES (?, ?, ?, ?)', 
                   (data['amount'], data['tag_id'], user['id'], data.get('date', datetime.utcnow())))
        db.commit()

        print('Transaction added successfully')  # Debugging statement
        return jsonify({"msg": "Transaction added successfully"}), 201
    except Exception as e:
        print(f"An error occurred: {e}")  # Debugging statement
        return jsonify({"msg": f"An error occurred: {e}"}), 500

@bp.route('/transactions/<int:id>', methods=['PUT'])
@jwt_required()
def update_transaction(id):
    try:
        current_user = get_jwt_identity()
        print(f"Current user: {current_user}")  # Debugging statement

        # Assuming current_user is a string (username)
        if isinstance(current_user, str):
            username = current_user
        else:
            return jsonify({"msg": "Invalid user data"}), 400

        data = request.get_json()
        if 'amount' not in data or 'tag_id' not in data:
            return jsonify({"msg": "Invalid data"}), 400

        db = get_db()
        user = db.execute('SELECT * FROM user WHERE username = ?', (username,)).fetchone()
        if user is None:
            return jsonify({"msg": "User not found"}), 404

        db.execute('UPDATE transactions SET amount = ?, tag_id = ? WHERE id = ? AND user_id = ?', 
                   (data['amount'], data['tag_id'], id, user['id']))
        db.commit()

        print('Transaction updated successfully')  # Debugging statement
        return jsonify({"msg": "Transaction updated successfully"}), 200
    except Exception as e:
        print(f"An error occurred: {e}")  # Debugging statement
        return jsonify({"msg": f"An error occurred: {e}"}), 500

@bp.route('/transactions/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_transaction(id):
    try:
        current_user = get_jwt_identity()
        print(f"Current user: {current_user}")  # Debugging statement

        # Assuming current_user is a string (username)
        if isinstance(current_user, str):
            username = current_user
        else:
            return jsonify({"msg": "Invalid user data"}), 400

        db = get_db()
        user = db.execute('SELECT * FROM user WHERE username = ?', (username,)).fetchone()
        if user is None:
            return jsonify({"msg": "User not found"}), 404

        db.execute('DELETE FROM transactions WHERE id = ? AND user_id = ?', (id, user['id']))
        db.commit()

        print('Transaction deleted successfully')  # Debugging statement
        return jsonify({"msg": "Transaction deleted successfully"}), 200
    except Exception as e:
        print(f"An error occurred: {e}")  # Debugging statement
        return jsonify({"msg": f"An error occurred: {e}"}), 500