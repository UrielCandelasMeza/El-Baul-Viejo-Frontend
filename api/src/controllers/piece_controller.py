from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from extensions import db
from src.models.piece_model import Piece, PieceStatus
from src.lib.files import allowed_file, build_file_path, MAX_SIZE
from supabase_client import supabase

bucket_name = "photos"
MAX_PHOTOS = 5


def _upload_photos(photos: list) -> tuple[list[str], str | None]:
    """
    Sube fotos al bucket usando su hash SHA-256 como nombre.
    Si el archivo ya existe (mismo hash), reutiliza la URL pública.
    """
    urls = []

    existing_files = supabase.storage.from_(bucket_name).list()
    existing_names = {f["name"] for f in existing_files}

    for photo in photos:
        if photo.filename == "" or not allowed_file(photo.filename):
            return [], "Solo se permiten: .jpg .jpeg .png .webp"

        file_bytes = photo.read()

        if len(file_bytes) > MAX_SIZE:
            return [], "Cada foto debe pesar menos de 5MB"

        file_path = build_file_path(file_bytes, photo.filename)

        if file_path not in existing_names:
            supabase.storage.from_(bucket_name).upload(
                file=file_bytes,
                path=file_path,
                file_options={"content-type": photo.content_type}
            )

        urls.append(supabase.storage.from_(bucket_name).get_public_url(file_path))

    return urls, None


def create_piece():
    """Inserts piece into the database and stores the images in supabase bucket"""
    name = request.form.get("name")
    price = request.form.get("price")
    description = request.form.get("description")
    photos = request.files.getlist("photos")
    category_ids = request.form.getlist("category_ids")
    user_id = get_jwt_identity()

    if not name or not price or len(category_ids) == 0 or len(photos) == 0:
        return jsonify({"success": False, "message": "Hay datos faltantes"}), 400

    if len(photos) > MAX_PHOTOS:
        return jsonify({"success": False, "message": "El máximo de fotos es 5"}), 400

    try:
        price = float(price)
    except ValueError:
        return jsonify({
                "success": False, 
                "message": "Debe ingresar un valor numérico en el precio"
            }), 400

    urls, error = _upload_photos(photos)
    if error:
        return jsonify({"success": False, "message": error}), 400

    new_piece = Piece(
        name=name,
        price=price,
        description=description,
        photos=urls,
        category_ids=category_ids,
        user_id=user_id,
    )
    db.session.add(new_piece)
    db.session.commit()

    return jsonify({"success": True, "message": "Pieza creada exitosamente"}), 201


def get_available_pieces():
    """Gets all available pieces from the db"""
    pieces = db.session.execute(
        db.select(Piece).where(Piece.status == PieceStatus.AVAILABLE)
    ).scalars().all()

    return jsonify({
        "success": True,
        "pieces": [p.to_dict() for p in pieces]
    }), 200


def get_all_pieces():
    """Gets all pieces from the db"""
    pieces = db.session.execute(
        db.select(Piece)
    ).scalars().all()

    return jsonify({
        "success": True,
        "pieces": [p.to_dict() for p in pieces]
    }), 200


def get_one_piece(piece_id: str):
    """Get one piece from the db"""
    piece = db.session.get(Piece, piece_id)

    if not piece:
        return jsonify({"success": False, "message": "Pieza no encontrada"}), 404

    return jsonify({
        "success": True,
        "piece": piece.to_dict()
    }), 200


def update_piece(piece_id: str):
    """Updates a piece"""
    piece = db.session.get(Piece, piece_id)
    if not piece:
        return jsonify({"success": False, "message": "Pieza no encontrada"}), 404

    name         = request.form.get("name")
    price        = request.form.get("price")
    description  = request.form.get("description")
    status       = request.form.get("status")
    category_ids = request.form.getlist("category_ids")
    new_photos   = request.files.getlist("photos")

    if name:
        piece.name = name
    if description:
        piece.description = description
    if category_ids:
        piece.category_ids = category_ids

    if price:
        try:
            piece.price = float(price)
        except ValueError:
            return jsonify({"success": False, "message": "Precio inválido"}), 400

    if status:
        try:
            piece.status = PieceStatus(status)
        except ValueError:
            valid = [s.value for s in PieceStatus]
            return jsonify({
                "success": False,
                "message": f"Status inválido. Opciones: {valid}"
            }), 400

    if new_photos and any(p.filename for p in new_photos):
        if len(new_photos) > MAX_PHOTOS:
            return jsonify({"success": False, "message": "El máximo de fotos es 5"}), 400

        incoming = {}
        for photo in new_photos:
            if not allowed_file(photo.filename):
                return jsonify({
                    "success": False,
                    "message": "Solo se permiten: .jpg .jpeg .png .webp"
                }), 400
            file_bytes = photo.read()

            if len(file_bytes) > MAX_SIZE:
                return jsonify({
                    "success": False, 
                    "message": "Cada foto debe pesar menos de 5MB"
                }), 400
            file_path = build_file_path(file_bytes, photo.filename)
            incoming[file_path] = (file_bytes, photo.content_type)

        current_paths = {url.split(f"{bucket_name}/")[-1].split("?")[0] for url in piece.photos}
        incoming_paths = set(incoming.keys())

        to_upload = incoming_paths - current_paths
        for file_path in to_upload:
            file_bytes, content_type = incoming[file_path]
            supabase.storage.from_(bucket_name).upload(
                file=file_bytes,
                path=file_path,
                file_options={"content-type": content_type}
            )

        to_delete = current_paths - incoming_paths
        if to_delete:
            supabase.storage.from_(bucket_name).remove(list(to_delete))

        piece.photos = [
            supabase.storage.from_(bucket_name).get_public_url(fp)
            for fp in incoming_paths
        ]

    db.session.commit()
    return jsonify({
        "success": True,
        "message": "Pieza actualizada",
        "piece": piece.to_dict()
    }), 200


def delete_piece(piece_id: str):
    """Deletes a piece and its photos from the bucket"""
    piece = db.session.get(Piece, piece_id)

    if not piece:
        return jsonify({"success": False, "message": "Pieza no encontrada"}), 404

    paths = [url.split(f"{bucket_name}/")[-1].split("?")[0] for url in piece.photos]
    if paths:
        supabase.storage.from_(bucket_name).remove(paths)

    db.session.delete(piece)
    db.session.commit()

    return jsonify({"success": True, "message": "Pieza eliminada exitosamente"}), 200
