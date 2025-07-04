# Authentication System Setup

This document explains the authentication system that has been set up for the Wealth Tracker application.

## 🚀 Features

- User registration with form validation
- User login with email or username
- Database integration with MongoDB
- Input validation using Zod
- Error handling for duplicate emails and usernames
- Loading states and user feedback

## 📁 Files Created/Modified

### Backend (Server)

- `server/auth-api.ts` - Authentication endpoints (register, login)
- `server/db/users-utils.ts` - Database functions for user management
- `server/index.ts` - Updated to include auth routes

### Frontend (Wealth Tracker)

- `wealth-tracker/src/pages/register.tsx` - Registration page with form validation
- `wealth-tracker/src/pages/index.tsx` - Login page with authentication

## 🔧 API Endpoints

### Register User

```
POST /auth/register
Content-Type: application/json

Body:
{
  "fullName": "John Doe",
  "userName": "johndoe123",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login User

```
POST /auth/login
Content-Type: application/json

Body:
{
  "emailOrUsername": "john@example.com", // or "johndoe123"
  "password": "password123"
}
```

## 🗄️ Database Schema

The Users collection stores:

- `fullName`: User's full name
- `userName`: Unique username (letters, numbers, underscores only)
- `email`: Unique email address
- `password`: User's password (stored as plain text - consider hashing in production)
- `createdAt`: Registration timestamp

## 🔐 Validation Rules

### Registration

- **Full Name**: Minimum 2 characters
- **Username**: Minimum 3 characters, alphanumeric + underscores only
- **Email**: Valid email format
- **Password**: Minimum 8 characters
- **Confirm Password**: Must match password

### Login

- **Email/Username**: Required field
- **Password**: Required field

## 🚦 How to Test

1. Start the server:

   ```bash
   cd server
   npm start
   ```

2. Start the frontend:

   ```bash
   cd wealth-tracker
   npm run dev
   ```

3. Navigate to `http://localhost:3000` for login
4. Navigate to `http://localhost:3000/register` for registration

## ⚠️ Security Considerations

- Passwords are currently stored as plain text
- Consider implementing password hashing (bcrypt)
- Add JWT tokens for session management

## 🔄 Next Steps

1. Add password hashing
2. Implement JWT authentication
3. Add session management
4. Create protected routes
5. Add logout functionality
6. Implement password reset feature
