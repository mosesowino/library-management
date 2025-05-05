from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from instance.config import Config
from flask_cors import CORS
import os
from dotenv import load_dotenv


db = SQLAlchemy()
migrate = Migrate()


def create_app():
    # frontend_url = os.getenv("FRONTEND_URL_DEV")
    app = Flask(__name__)
    load_dotenv()
    # print(f"Frontend URL: {frontend_url}")
    CORS(app, origins=["http://localhost:3000", "http://192.168.56.1:3000"], supports_credentials=True)

    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Import and register routes
    with app.app_context():
        from app import routes, models
        app.register_blueprint(routes.routes)


    return app