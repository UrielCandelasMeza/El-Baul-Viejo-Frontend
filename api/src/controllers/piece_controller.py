import uuid
from flask import jsonify, request
from extensions import db
from src.models.piece_model import Piece
from src.lib.files import allowed_file
from supabase_client import supabase

MAX_PHOTOS = 5
MAX_SIZE = 5 * 1024 * 1024
bucket_name = "photos"

def create_piece():
    """Inserts piece into the database and stores the images in supabase bucket"""
    name = request.form.get("name")
    price = request.form.get("price")
    description = request.form.get("description")
    photos = request.files.getlist("photos")

    if not name or not price or not description or len(photos) == 0:
        return jsonify({
            "success": False,
            "message": "Hay datos faltantes"
        }), 400

    if len(photos) > MAX_PHOTOS:
        return jsonify({
            "success": False,
            "message": "El máximo de fotos es 5"
        }), 400

    try:
        float(price)
    except ValueError:
        return jsonify({
            "success": False,
            "message": "Debe ingresar un valor numérico en el precio"
        }), 400                                      

    for photo in photos:
        photo.seek(0, 2)
        if photo.tell() > MAX_SIZE:
            return jsonify({
                "success": False,
                "message": "Cada foto debe pesar menos de 5MB"
            }), 400
        photo.seek(0)
        if photo.filename == "" or not allowed_file(photo.filename):
            return jsonify({
                "success": False,
                "message": "Solo se permiten: .jpg .jpeg .png .webp"
            }), 400

    urls = []
    for photo in photos:

        file_path = f"{uuid.uuid4()}.{photo.filename.rsplit('.', 1)[1].lower()}"

        supabase.storage.from_(bucket_name).upload(
            file=photo.read(),
            path=file_path,
            file_options={"content-type": photo.content_type}
        )
        res = supabase.storage.from_(bucket_name).get_public_url(file_path)
        urls.append(res)

    new_piece = Piece(
        name=name,
        price=float(price),
        description=description,
        photos=urls
    )
    db.session.add(new_piece)
    db.session.commit()
    return jsonify({"success": True, "message": "Pieza creada exitosamente"}), 201
