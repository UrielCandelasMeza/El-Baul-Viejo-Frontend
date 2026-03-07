"""Routes for the category"""
from flask import Blueprint
from src.controllers.category_controller import (
    get_categories,
    create_category,
    delete_category,
)
from src.lib.jwt import jwt_required_cookie

category_bp = Blueprint("category", __name__)

category_bp.route("/get", methods=["GET"])(get_categories)  # público
category_bp.route("/create", methods=["POST"])(jwt_required_cookie(create_category))
category_bp.route("/delete/<string:category_id>", methods=["DELETE"])(jwt_required_cookie(delete_category))
