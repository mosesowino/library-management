from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.config import Config
from flask_cors import CORS
import os
from dotenv import load_dotenv


db = SQLAlchemy()
migrate = Migrate()


def create_app():
    load_dotenv()
    app = Flask(__name__)
    frontend_url = os.getenv("FRONTEND_URL")
    CORS(app, origins=[frontend_url], supports_credentials=True)

    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Import and register routes
    with app.app_context():
        from app import routes, models
        app.register_blueprint(routes.routes)


    return app
