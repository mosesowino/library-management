import pytest
import json
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.models import Book, Member, Transaction

import pytest
import json
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.models import Book, Member, Transaction
from app.config import TestConfig

import pytest
import json
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.models import Book, Member, Transaction
from app.config import TestConfig

@pytest.fixture
def app():
    app = create_app()
    app.config.from_object(TestConfig)
    app.config.update({
        "TESTING": True,
    })

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_get_books_empty(client):
    response = client.get("/books")
    assert response.status_code == 200
    assert response.json == []

def test_add_book(client):
    book_data = {
        "title": "Test Book",
        "author": "Author A",
        "copies": 5,
        "fee": 10,
        "issued": 0
    }
    response = client.post("/books", json=book_data)
    assert response.status_code == 201
    assert response.json["message"] == "Book added successfully!"
    assert response.json["book"]["title"] == "Test Book"

def test_get_members_empty(client):
    response = client.get("/members")
    assert response.status_code == 200
    assert response.json == []

def test_add_member(client):
    member_data = {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890"
    }
    response = client.post("/members", json=member_data)
    assert response.status_code == 201
    assert response.json["message"] == "Member added successfully!"
    assert response.json["member"]["name"] == "John Doe"

def test_issue_book(client, app):
    # Add book
    book_data = {
        "title": "Issue Book",
        "author": "Author B",
        "copies": 3,
        "fee": 5,
        "issued": 0
    }
    client.post("/books", json=book_data)

    # Add member
    member_data = {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "phone": "0987654321"
    }
    client.post("/members", json=member_data)

    with app.app_context():
        book = Book.query.filter_by(title="Issue Book").first()
        member = Member.query.filter_by(name="Jane Doe").first()

    # Issue book
    transaction_data = {
        "book_id": book.id,
        "member_id": member.id
    }
    response = client.post("/transactions", json=transaction_data)
    assert response.status_code == 201
    assert response.json["message"] == "Book issued successfully!"

def test_return_book(client, app):
    # Add book
    book_data = {
        "title": "Return Book",
        "author": "Author C",
        "copies": 2,
        "fee": 7,
        "issued": 0
    }
    client.post("/books", json=book_data)

    # Add member
    member_data = {
        "name": "Alice",
        "email": "alice@example.com",
        "phone": "1112223333"
    }
    client.post("/members", json=member_data)

    with app.app_context():
        book = Book.query.filter_by(title="Return Book").first()
        member = Member.query.filter_by(name="Alice").first()

    # Issue book
    transaction_data = {
        "book_id": book.id,
        "member_id": member.id
    }
    client.post("/transactions", json=transaction_data)

    # Return book with payment
    return_data = {
        "book_id": book.id,
        "member_id": member.id,
        "payment": 7
    }
    response = client.post("/return", json=return_data)
    assert response.status_code == 200
    assert response.json["message"] == "Book returned successfully!"
