from flask import Flask
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from flask_cors import CORS
import os

load_dotenv(dotenv_path='venv/secret.env')

app = Flask(__name__)
CORS(app)
app.config['DATABASE'] = os.getenv('DATABASE')  # Default to SQLite if not set
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

from .db import get_db, close_db
from .init_db import init_db
# init db
init_db()

# clean up
@app.teardown_appcontext
def close_db_wrapper(e=None): #use a wrapper function to pass the error to close_db
    close_db(e)

from .routes import auth, transactions, tags

# register the blueprints
app.register_blueprint(auth.bp)
app.register_blueprint(transactions.bp)
app.register_blueprint(tags.bp)

if __name__ == '__main__':
    app.run(debug=True)