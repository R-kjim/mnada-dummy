from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
import secrets,os

db = SQLAlchemy()

def create_app():
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DATABASE = os.environ.get(
        "DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'auction_platform.db')}")
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE
    app.config['SECRET_KEY'] = secrets.token_hex(32)
    app.config['DEBUG'] = True  # Enable debug mode for development

   

    return app
