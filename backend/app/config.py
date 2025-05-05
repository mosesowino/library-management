from os import environ
from dotenv import load_dotenv
load_dotenv()


class Config:
    db_uri = "mysql+pymysql://administrator:administratorpassword_@database-2.cpu6c04gkauk.eu-north-1.rds.amazonaws.com:3306/librarymanager"
    SECRET_KEY = environ.get('SECRET_KEY') or 'default'
    SQLALCHEMY_DATABASE_URI =  environ.get('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = environ.get('FLASK_DEBUG')

class TestConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SQLALCHEMY_TRACK_MODIFICATIONS = False




