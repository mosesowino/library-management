from os import environ
from dotenv import load_dotenv
load_dotenv()

class Config:
    SECRET_KEY = environ.get('SECRET_KEY') or 'your_default_secret_key'
    SQLALCHEMY_DATABASE_URI = environ.get('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = environ.get('FLASK_DEBUG')
    SQLALCHEMY_POOL_SIZE = 20  # Increase the max number of connections in pool
    SQLALCHEMY_MAX_OVERFLOW = 30  # Increase max extra connections to handle bursts of traffic
    SQLALCHEMY_POOL_TIMEOUT = 600  # Increase timeout to wait for a connection before failing
    SQLALCHEMY_POOL_RECYCLE = 1800  # Recycle connection every 30 minutes
    # FRONTEND_URL = environ.get('FRONTEND_URL_DEV')




