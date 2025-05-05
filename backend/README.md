# Library Management System - Backend

## Project Overview
This is the backend service for the Library Management System. It is built using Flask and provides RESTful API endpoints to manage books, members, transactions, and payments. The backend connects to a MySQL database and supports features such as book issuing, returning, member debt management, and more.

## Features
- Manage books: add, update, delete, and list books.
- Manage members: add, update, delete, and list members.
- Issue and return books with transaction tracking.
- Manage member debts and payments.
- RESTful API design with JSON responses.
- Database migrations support with Flask-Migrate.
- Cross-Origin Resource Sharing (CORS) enabled for frontend integration.

## Technologies Used
- Python 3.x
- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-CORS
- MySQL (Amazon RDS)
- dotenv for environment variable management

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate   # On Windows
   source venv/bin/activate  # On macOS/Linux
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the `backend/` directory with the following variables:
   ```
   SECRET_KEY=your_secret_key
   FLASK_DEBUG=1
   FRONTEND_URL=https://library-management-lqdj.vercel.app
   SQLALCHEMY_DATABASE_URI=mysql+pymysql://administrator:administratorpassword_@database-2.cpu6c04gkauk.eu-north-1.rds.amazonaws.com:3306/librarymanager
   ```

## Configuration
The application configuration is managed in `app/config.py`. Key settings include:
- `SECRET_KEY`: Flask secret key for sessions and security.
- `SQLALCHEMY_DATABASE_URI`: Database connection string.
- SQLAlchemy connection pool settings for performance.
- Debug mode controlled by `FLASK_DEBUG`.

## Running the Application
To start the Flask backend server, run:
```bash
python run.py
```
The server will start on port 5000 by default.

## API Endpoints

### Books
- `GET /books` - List all books.
- `POST /books` - Add a new book.
- `GET /books/<book_id>` - Get details of a specific book.
- `PUT /books/<book_id>` - Update a book.
- `DELETE /books/delete/<book_id>` - Delete a book.

### Members
- `GET /members` - List all members.
- `POST /members` - Add a new member.
- `GET /members/<member_id>` - Get details of a specific member.
- `PUT /members/<member_id>` - Update a member.
- `PUT /members/debtUpdate/<member_id>` - Update member debt.
- `DELETE /members/delete/<member_id>` - Delete a member.

### Transactions
- `GET /transactions` - List all transactions.
- `POST /transactions` - Issue a book to a member.
- `POST /return` - Return a book.
- `GET /issued_books` - List all currently issued books.

### Payments
- `POST /make_payment` - Make a payment to reduce member debt.

## Database Migrations
This project uses Flask-Migrate for database migrations.

To initialize migrations (if not done):
```bash
flask db init
```

To create a migration after model changes:
```bash
flask db migrate -m "Migration message"
```

To apply migrations:
```bash
flask db upgrade
```

## Testing
Tests are located in the `tests/` directory. To run tests, use:
```bash
pytest
```

## License
Specify your license here (e.g., MIT License).

## Contact
For support or inquiries, please contact [Your Name] at [your.email@example.com].
