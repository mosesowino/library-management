from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    total_copies = db.Column(db.Integer, default=1)
    issued_copies = db.Column(db.Integer, default=0)
    cost_per_day = db.Column(db.Integer, default=0.0)
    transactions = db.relationship('Transaction', backref='book', lazy=True, passive_deletes=True)

class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(15), nullable=True)
    debt = db.Column(db.Integer, default=0.0)
    transactions = db.relationship('Transaction', backref='member', lazy=True, passive_deletes=True)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    member_id = db.Column(db.Integer, db.ForeignKey('member.id'), nullable=False)
    issue_date = db.Column(db.DateTime, nullable=False)
    return_date = db.Column(db.DateTime, nullable=True)
    fee = db.Column(db.Integer, default=0.0)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id', ondelete='CASCADE'))
    member_id = db.Column(db.Integer, db.ForeignKey('member.id', ondelete='CASCADE'))