# Library Manager Backend

## Project Description
This is the backend service for the Library Manager application. It is built using Flask, providing RESTful API endpoints to manage books, members, and transactions such as issuing and returning books. The backend also serves the frontend static files.

## Features Overview
- Manage books: add, update, delete, and list books.
- Manage members: add, update, delete, and list members.
- Manage transactions: issue books, return books, and track payments.
- Serve frontend static files including HTML, CSS, and JavaScript.
- Database migrations support using Flask-Migrate.
- Environment-based configuration for flexibility.

## Technologies Used
- Python 3
- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- MySQL (via SQLAlchemy)
- python-dotenv for environment variable management

## Setup Instructions

### Installing Dependencies
Install the required Python packages using pip:

```bash
pip install -r requirements.txt
```

For development dependencies, use:

```bash
pip install -r dev-requirements.txt
```

### Environment Variables Configuration
Create a `.env` file in the backend directory to configure environment variables. At minimum, set:

```
SECRET_KEY=your_secret_key
FLASK_DEBUG=1
SQLALCHEMY_DATABASE_URI=mysql+pymysql://username:password@host:port/database
```

The app also has a default database URI configured in `app/config.py` which can be overridden by environment variables.

### Database Setup and Migrations
The backend uses MySQL as the database. Ensure you have a MySQL server running and accessible.

Initialize and apply database migrations using Flask-Migrate:

```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

Note: The Flask CLI commands require the `FLASK_APP` environment variable to be set, e.g.:

```bash
export FLASK_APP=run.py
```

On Windows CMD:

```cmd
set FLASK_APP=run.py
```

## Running the Application
Run the backend server using:

```bash
python run.py
```

The server will start on port 5000 by default.

## API Endpoints Summary

### Books
- `GET /books` - List all books
- `POST /books` - Add a new book
- `GET /books/<book_id>` - Get details of a book
- `PUT /books/<book_id>` - Update a book
- `DELETE /books/delete/<book_id>` - Delete a book

### Members
- `GET /members` - List all members
- `POST /members` - Add a new member
- `GET /members/<member_id>` - Get details of a member
- `PUT /members/<member_id>` - Update a member
- `PUT /members/debtUpdate/<member_id>` - Update member debt
- `DELETE /members/delete/<member_id>` - Delete a member

### Transactions
- `GET /transactions` - List all transactions
- `POST /transactions` - Issue a book to a member
- `POST /return` - Return a book
- `GET /issued_books` - List currently issued books
- `POST /make_payment` - Make a payment towards member debt

## Folder Structure Overview
```
backend/
├── app/                    # Flask application package
│   ├── __init__.py         # App factory and initialization
│   ├── config.py           # Configuration settings
│   ├── models.py           # Database models (Books, Members, Transactions)
│   └── routes.py           # API route definitions
├── migrations/             # Database migration files
├── static/                 # Static files served by Flask (includes frontend)
├── dev-requirements.txt    # Development dependencies
├── requirements.txt        # Production dependencies
├── run.py                  # Application entry point
├── .env                    # Environment variables (not committed)
└── README.md               # This file
```

## Additional Notes
- Ensure your MySQL database credentials and connection details are correctly set in environment variables or `app/config.py`.
- The backend serves a frontend SPA located in the `static/frontend` directory.
- Use Postman or similar tools to test API endpoints during development.

## Contact
For questions or support, please contact the project maintainer.
