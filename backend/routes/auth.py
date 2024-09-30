from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, JWTManager, get_jwt
from ..db import get_db
import sqlite3

bp = Blueprint('auth', __name__)

jwt = JWTManager()

def init_jwt(app):
    jwt.init_app(app)

blacklist = set()

@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    return jti in blacklist

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    db = get_db()
    try:
        db.execute('INSERT INTO user (username, password) VALUES (?, ?)', (data['username'], hashed_password))
        db.commit()
    except sqlite3.IntegrityError:
        return jsonify({"error": "User already exists"}), 400

    access_token = create_access_token(identity=data['username'])
    refresh_token = create_refresh_token(identity=data['username'])

    return jsonify(access_token=access_token, refresh_token=refresh_token), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    db = get_db()
    user = db.execute('SELECT * FROM user WHERE username = ?', (data['username'],)).fetchone()
    if user is None: 
        return jsonify({"error": "User does not exist"}), 401
    if not check_password_hash(user['password'], data['password']):
        return jsonify({"error": "Incorrect password"}), 401
    access_token = create_access_token(identity=data['username'])
    refresh_token = create_refresh_token(identity=data['username'])
    return jsonify(access_token=access_token, refresh_token=refresh_token), 200

@bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()['jti']
    blacklist.add(jti)
    return jsonify({"message": "User logged out successfully"}), 200

@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify(access_token=new_access_token), 200

@bp.route('/delete_user', methods=['POST'])
@jwt_required()
def delete_user():
    data = request.get_json()
    username = data.get('username')
    if not username:
        return jsonify({"error": "Username is required"}), 400

    db = get_db()
    user = db.execute('SELECT * FROM user WHERE username = ?', (username,)).fetchone()
    if user is None:
        return jsonify({"error": "User does not exist"}), 404

    db.execute('DELETE FROM user WHERE username = ?', (username,))
    db.commit()
    return jsonify({"message": "User deleted successfully"}), 200