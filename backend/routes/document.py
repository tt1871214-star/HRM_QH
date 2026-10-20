
import os
import json

from flask import (
    Blueprint,
    request,
    jsonify,
    send_from_directory,
)

from flask_cors import cross_origin

document_bp = Blueprint("document", __name__)

UPLOAD_DIR = "uploads"

JSON_FILE = "documents.json"

# tạo folder uploads nếu chưa có
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ==========================================
# HELPER
# ==========================================

def load_documents():

    # nếu chưa có file json
    if not os.path.exists(JSON_FILE):
        return []

    try:

        with open(
            JSON_FILE,
            "r",
            encoding="utf-8"
        ) as f:

            content = f.read().strip()

            # file rỗng
            if not content:
                return []

            return json.loads(content)

    except Exception as e:

        print("JSON ERROR:", e)

        return []


def save_documents(data):

    with open(
        JSON_FILE,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            data,
            f,
            ensure_ascii=False,
            indent=2
        )

# ==========================================
# GET ALL DOCUMENTS
# ==========================================

@document_bp.route(
    "/documents",
    methods=["GET"]
)
@cross_origin()
def get_documents():

    docs = load_documents()

    return jsonify(docs)

# ==========================================
# CREATE DOCUMENT
# ==========================================

@document_bp.route(
    "/documents",
    methods=["POST"]
)
@cross_origin()
def create_document():

    data = request.json

    docs = load_documents()

    docs.append(data)

    save_documents(docs)

    return jsonify({
        "message": "Document saved"
    })

# ==========================================
# DELETE DOCUMENT
# ==========================================

@document_bp.route(
    "/documents/<int:doc_id>",
    methods=["DELETE"]
)
@cross_origin()
def delete_document(doc_id):

    docs = load_documents()

    new_docs = [
        d for d in docs
        if d["id"] != doc_id
    ]

    save_documents(new_docs)

    return jsonify({
        "message": "Deleted"
    })

# ==========================================
# UPLOAD FILE
# ==========================================

@document_bp.route(
    "/documents/upload",
    methods=["POST"]
)
@cross_origin()
def upload_document():

    file = request.files.get("file")

    if not file:

        return jsonify({
            "error": "No file uploaded"
        }), 400

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    file.save(file_path)

    return jsonify({
        "filename": file.filename,
        "path": file_path
    })

# ==========================================
# DOWNLOAD FILE
# ==========================================

@document_bp.route(
    "/uploads/<filename>"
)
@cross_origin()
def uploaded_file(filename):

    return send_from_directory(
        UPLOAD_DIR,
        filename
    )
