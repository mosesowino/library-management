from flask import Blueprint, jsonify, render_template, request, redirect, url_for
from .models import Book, Member, Transaction
from . import db
from datetime import datetime
from sqlalchemy.orm import joinedload
from sqlalchemy import insert, update

now = datetime.now()
# now = now.strftime('%Y-%m-%d %H:%M:%S')
now = now.strftime('%Y-%m-%d')



routes = Blueprint("routes", __name__)

@routes.route("/")
def serve_index():
    return jsonify({"message": "Welcome to the Library Management System API!"})

@routes.route("/books", methods=["GET", "POST"])
def manage_books():
    if request.method == "POST":
        data = request.get_json()  # Getting data from JSON body
        title = data.get("title")
        author = data.get("author")
        copies = int(data.get("copies"))
        fee = int(data.get("fee"))
        issued = int(data.get("issued"))
        new_book = Book(title=title, author=author, total_copies=copies, cost_per_day=fee, issued_copies=issued)
        print(new_book)
        db.session.add(new_book)
        db.session.commit()
        
        return jsonify({
            "message": "Book added successfully!",
            "book": {
                "author": new_book.author,
                "title": new_book.title
            }
        }), 201
    
    if request.method == "GET":
        books = Book.query.all()
        books_data = [
        {
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "total_copies": book.total_copies,
            "issued_copies": book.issued_copies,
            "cost_per_day": book.cost_per_day
        }
        for book in books
        ] 
        return jsonify(books_data)


@routes.route("/books/<int:book_id>", methods=["PUT", "GET"])
def edit_book(book_id):
    book = Book.query.get_or_404(book_id)

    if request.method == "PUT":
        data = request.get_json()

        update_data = {}
        if "title" in data:
            update_data["title"] = data["title"]
        if "author" in data:
            update_data["author"] = data["author"]
        if "copies" in data:
            update_data["total_copies"] = data["copies"]
        if "fee" in data:
            update_data["cost_per_day"] = data["fee"]

        if update_data:
            stmt = (
                update(Book)
                .where(Book.id == book_id)
                .values(**update_data)
            )
            db.session.execute(stmt)
            db.session.commit()

        return jsonify({
            "message": "Book updated successfully!",
            "book": {
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "total_copies": book.total_copies,
                "issued_copies": book.issued_copies,
                "cost_per_day": book.cost_per_day
            }
        }), 200

    return jsonify({
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "total_copies": book.total_copies,
        "issued_copies": book.issued_copies,
        "cost_per_day": book.cost_per_day
    })



@routes.route("/books/delete/<int:book_id>", methods=["DELETE"])
def delete_book(book_id):
    book = db.session.query(Book).filter_by(id=book_id)
    book.delete()
    db.session.commit()

    return jsonify({
        "message": "Book deleted successfully!",
        "book_id": book_id
    }), 200



@routes.route("/members", methods=["GET", "POST"])
def manage_members():
    if request.method == "POST":
        data = request.get_json()  
        name = data.get("name")
        email = data.get("email")
        phone = data.get("phone")
        new_member = Member(name=name, email=email, phone=phone, debt=0.0)
        db.session.add(new_member)
        db.session.commit()
        

        return jsonify({
            "message": "Member added successfully!",
            "member": {
                "id": new_member.id,
                "name": new_member.name
            }
        }), 201
    
    members = Member.query.all()
    members_data = [
        {
            "id": member.id,
            "name": member.name,
            "debt": member.debt

        }
        for member in members
    ]
    
    return jsonify(members_data)



@routes.route("/members/<int:member_id>", methods=["GET", "PUT"])
def edit_member(member_id):
    if request.method == 'PUT':
        data = request.get_json()

        update_data = {}
        if "name" in data:
            update_data["name"] = data["name"]
        if "phone" in data:
            update_data["phone"] = data["phone"]

        if not update_data:
            return jsonify({"message": "No valid fields to update"}), 400

        stmt = (
            update(Member)
            .where(Member.id == member_id)
            .values(**update_data)
        )
        db.session.execute(stmt)
        db.session.commit()

        updated_member = Member.query.get(member_id)

        return jsonify({
            "message": "Member updated successfully!",
            "member": {
                "id": updated_member.id,
                "name": updated_member.name,
                "phone": updated_member.phone
            }
        }), 200

    member = Member.query.get_or_404(member_id)
    return jsonify({
        "id": member.id,
        "name": member.name,
        "phone": member.phone,
    })


@routes.route("/members/debtUpdate/<int:member_id>", methods=["PUT"])
def debt_update(member_id):
    data = request.get_json()
    new_debt = data["newDebt"]
    print("bababab:  ", new_debt)

    db.session.execute(
        update(Member)
        .where(Member.id == member_id)
        .values(debt=Member.debt + int(new_debt))
    )
    db.session.commit()

    return jsonify({
        "message": "updated member debt successfully"
    }), 200




@routes.route("/members/delete/<int:member_id>", methods=["DELETE"])
def delete_member(member_id):
    member = db.session.query(Member).filter_by(id=member_id)
    print(member)
    member.delete()
    db.session.commit()
    

    return jsonify({
        "message": "Member deleted successfully!",
        "member_id": member_id
    }), 200



@routes.route("/transactions", methods=["GET", "POST"])
def manage_transactions():
    if request.method == "POST":
        issue_date = now

        data = request.get_json()
        book_id = int(data.get("book_id"))
        member_id = int(data.get("member_id"))

        book = Book.query.get_or_404(book_id)
        book_fee = book.cost_per_day

        try:
            stmt = insert(Transaction).values(
                book_id=book_id,
                member_id=member_id,
                issue_date=issue_date,
                fee=book_fee
            )
            db.session.execute(stmt)

            db.session.execute(
                update(Book)
                .where(Book.id == book_id)
                .values(issued_copies=Book.issued_copies + 1)
            )

            # db.session.execute(
            #     update(Member)
            #     .where(Member.id == member_id)
            #     .values(debt=Member.debt + book_fee)
            # )

            db.session.commit()

            return jsonify({
                "message": "Book issued successfully!"
            }), 201

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Failed to issue book", "details": str(e)}), 500



    
    if request.method == "GET":
        transactions = Transaction.query.all()
        # issue_date = transaction.issue_date.isoformat()
        # return_date = transaction.return_date.isoformat() if transaction.return_date else None,

        print(transactions)
        transactions_data = [
            {
                "id": transaction.id,
                "book_id": transaction.book_id,
                "book_title": (Book.query.get(transaction.book_id)).title,
                "author": (Book.query.get(transaction.book_id)).author,
                "member_id": transaction.member_id,
                "member_name": (Member.query.get(transaction.member_id)).name,
                "issue_date": transaction.issue_date.isoformat(),
                "return_date": transaction.return_date.isoformat() if transaction.return_date else None,
                "fee": transaction.fee,
                "total_days": ((transaction.return_date - transaction.issue_date).days if transaction.return_date else None
            ),
            }
            for transaction in transactions
        ]
        
        return jsonify(transactions_data)


@routes.route("/return", methods=["POST"])
def return_book():
    data = request.get_json()
    book_id = data.get("book_id")
    member_id = data.get("member_id")
    payment = int(data.get("payment"))
    print(book_id, member_id, payment)

    if not book_id or not member_id:
        return jsonify({"error": "book_id and member_id are required"}), 400

    if not isinstance(payment, (int, float)) or payment <= 0:
        return jsonify({"error": "Invalid payment amount"}), 400


    transaction = Transaction.query.filter_by(
        book_id=book_id,
        member_id=member_id,
        return_date=None
    ).first()

    if not transaction:
        return jsonify({"error": "Active transaction not found for this book and member"}), 404


    db.session.execute(
        update(Transaction)
        .where(Transaction.id == transaction.id)
        .values(return_date=now)
    )

    db.session.execute(
        update(Book)
        .where(Book.id == book_id)
        .values(issued_copies=Book.issued_copies - 1)
    )

    db.session.execute(
        update(Member)
        .where(Member.id == member_id)
        .values(debt=Member.debt - payment)  
    )

    db.session.commit()

    return jsonify({
        "message": "Book returned successfully!",
        "transaction_id": transaction.id
    }), 200

# except Exception as e:
#     db.session.rollback()
#     return jsonify({"error": "Failed to return book", "details": str(e)}), 500



@routes.route("/issued_books", methods=["GET"])
def get_issued_books():
    issued_books = Transaction.query.options(
        joinedload(Transaction.member),
        joinedload(Transaction.book)
    ).filter(Transaction.return_date == None).all()
    issued_books_data = [
        {
            "id": transaction.id,
            "book_id": transaction.book_id,
            "member_id": transaction.member_id,
            "member_name": transaction.member.name if transaction.member else None,
            "book_title": transaction.book.title if transaction.book else None,
            "issue_date": transaction.issue_date.isoformat(),
            "return_date": transaction.return_date.isoformat() if transaction.return_date else None,
            "fee": transaction.fee
        }
        for transaction in issued_books
    ]
    
    return jsonify(issued_books_data)



@routes.route("/make_payment", methods=["POST"])
def make_payment():
    data = request.get_json()
    member_id = int(data.get("member_id"))
    amount = int(data.get("amount"))
    print(member_id, amount)

    if not member_id or not amount:
        return jsonify({"error": "member_id and amount are required"}), 400

    member = Member.query.get(member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404

    try:
        db.session.execute(
            update(Member)
            .where(Member.id == member_id)
            .values(debt=Member.debt - amount)
        )
        db.session.commit()

        updated_member = Member.query.get(member_id)

        return jsonify({
            "message": "Payment processed successfully!",
            "new_debt": updated_member.debt
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to process payment", "details": str(e)}), 500