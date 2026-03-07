"""Main app"""
import os
from flask import Flask
from dotenv import load_dotenv
from config import get_config
from extensions import init_extensions
from src.routes.auth_routes import auth_bp

load_dotenv()


def create_app() -> Flask:
    """Create and configure flask app"""
    app = Flask(__name__)
    app.config.from_object(get_config())

    init_extensions(app)

    # Registrar blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    # app.register_blueprint(users_bp, url_prefix="/api/users")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 3000)),
        debug=os.getenv("FLASK_ENV", "development") == "development",
    )
