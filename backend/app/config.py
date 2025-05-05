from os import environ
from dotenv import load_dotenv
load_dotenv()


class Config:
    db_uri = "mysql+pymysql://administrator:administratorpassword_@database-2.cpu6c04gkauk.eu-north-1.rds.amazonaws.com:3306/librarymanager"
    SECRET_KEY = environ.get('SECRET_KEY') or 'your_default_secret_key'
    SQLALCHEMY_DATABASE_URI = db_uri or environ.get('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = environ.get('FLASK_DEBUG')
    SQLALCHEMY_POOL_SIZE = 20  
    SQLALCHEMY_MAX_OVERFLOW = 30
    SQLALCHEMY_POOL_TIMEOUT = 600 
    SQLALCHEMY_POOL_RECYCLE = 1800 




