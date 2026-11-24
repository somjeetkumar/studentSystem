
# Student Management System - Email Integration

A Node.js and Express.js application that uses PostgreSQL for user registration and Nodemailer to automatically send welcome emails to newly registered users through Gmail SMTP.

## Tech Stack

- Node.js & Express.js
- PostgreSQL
- Nodemailer
- bcrypt
- dotenv

## Installation

```bash
npm install
npm install nodemailer dotenv
```

## Environment Variables

Create a `.env` file in the backend root directory:

```env
PORT=5000
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_16_character_app_password
```

**Gmail App Password Setup:**

1. Enable 2-Step Verification in your Google account.
2. Visit https://myaccount.google.com/apppasswords
3. Generate an App Password.
4. Add it to `EMAIL_PASS`.

## Project Structure

```text
backend/
├── config/
│   └── email.js
├── controllers/
│   └── authController.js
├── routes/
│   └── authRoutes.js
├── .env
├── .gitignore
└── server.js
```

## API Documentation

### Register User

**Endpoint:** `POST /api/auth/register`

**Request Body:**

```json
{
    "name": "Somjeet",
    "email": "somjeet@gmail.com",
    "password": "123456"
}
```

**Success Response:**

```json
{
    "message": "Registration successful",
    "user": {
        "id": 1,
        "name": "Somjeet",
        "email": "somjeet@gmail.com"
    }
}
```

## Registration Workflow

1. Validate user input.
2. Check whether the email already exists.
3. Hash the password using bcrypt.
4. Save user details in PostgreSQL.
5. Send a welcome email using Nodemailer.
6. Return the registration response.

## Run Application

```bash
npm run dev
```

Or:

```bash
node server.js
```

## Security

- Never expose Gmail credentials.
- Never upload `.env` to GitHub.
- Always hash passwords using bcrypt.
- Handle email errors separately from registration errors.

Add the following to `.gitignore`:

```gitignore
node_modules/
.env
```

## Author

Somjeet Kumar
