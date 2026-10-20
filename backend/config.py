import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")


class Config:
    SECRET_KEY = os.environ["SECRET_KEY"]
    JWT_SECRET_KEY = os.environ["JWT_SECRET_KEY"]
    SQL_SERVER_CONN = os.environ["SQL_SERVER_CONN"]
    MYSQL_CONN = os.environ["MYSQL_CONN"]

    SQLALCHEMY_DATABASE_URI = MYSQL_CONN
    SQLALCHEMY_TRACK_MODIFICATIONS = False