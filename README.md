# EduBridge - Student Textbook Marketplace

EduBridge is a platform that connects students for buying and selling textbooks. It provides a streamlined marketplace where students can list their used textbooks for sale or donation and browse textbooks offered by other students.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Security Implementation](#security-implementation)
- [Setup and Installation](#setup-and-installation)
- [Project Structure](#project-structure)
- [API and Services](#api-and-services)

## Overview

EduBridge aims to solve the problem of expensive textbooks by creating a peer-to-peer marketplace specifically for students. The platform allows students to:

- Browse available textbooks by category, search terms, and filters
- List their own textbooks for sale or donation
- Manage their listings and track sales
- Purchase textbooks from other students
- Create and manage user profiles

## Features

- **User Authentication**: Email/password login, social login (Google, GitHub), and anonymous browsing
- **Textbook Marketplace**: Browse, search, and filter available textbooks
- **Textbook Listings**: List textbooks for sale with details like condition, price, and description
- **User Dashboard**: Manage listings, track purchases, and view statistics
- **Shopping Cart**: Add books to cart and complete purchases
- **User Profiles**: Create and manage user profiles with personal information

## Technology Stack

- **Frontend**: React.js with React Router for navigation
- **Backend**: Supabase (PostgreSQL database, authentication, storage)
- **Styling**: CSS with custom components
- **State Management**: React hooks and context
- **Deployment**: Hosted on Supabase platform

## Database Schema

The application uses the following database tables in Supabase:

### profiles

Stores user profile information linked to Supabase Auth users.

| Column          | Type      | Description                           |
|-----------------|-----------|---------------------------------------|
| id              | UUID      | Primary key                           |
| user_id         | UUID      | Foreign key to auth.users             |
| full_name       | TEXT      | User's full name                      |
| email           | TEXT      | User's email address                  |
| course_of_study | TEXT      | User's course or field of study       |
| created_at      | TIMESTAMP | Creation timestamp                    |
| updated_at      | TIMESTAMP | Last update timestamp                 |

### categories

Stores book categories/subjects.

| Column          | Type      | Description                           |
|-----------------|-----------|---------------------------------------|
| id              | UUID      | Primary key                           |
| name            | TEXT      | Category name                         |
| created_at      | TIMESTAMP | Creation timestamp                    |
| updated_at      | TIMESTAMP | Last update timestamp                 |

### books

Stores textbook listings.

| Column              | Type          | Description                           |
|---------------------|---------------|---------------------------------------|
| id                  | UUID          | Primary key                           |
| title               | TEXT          | Book title                            |
| author              | TEXT          | Book author                           |
| isbn                | TEXT          | ISBN number                           |
| edition             | TEXT          | Book edition                          |
| publisher           | TEXT          | Publisher name                        |
| publication_year    | TEXT          | Year of publication                   |
| category_id         | UUID          | Foreign key to categories             |
| selling_price       | DECIMAL(10,2) | Price in local currency               |
| condition_rating    | TEXT          | Book condition (Good, Fair, etc.)     |
| description         | TEXT          | Book description                      |
| availability_status | TEXT          | Status (Available, Sold)              |
| seller_id           | UUID          | Foreign key to profiles               |
| created_at          | TIMESTAMP     | Creation timestamp                    |
| updated_at          | TIMESTAMP     | Last update timestamp                 |

### cart

Stores items in a user's shopping cart.

| Column          | Type      | Description                           |
|-----------------|-----------|---------------------------------------|
| id              | UUID      | Primary key                           |
| user_id         | UUID      | Foreign key to profiles               |
| book_id         | UUID      | Foreign key to books                  |
| created_at      | TIMESTAMP | Creation timestamp                    |

### purchases

Stores completed purchases.

| Column          | Type          | Description                           |
|-----------------|---------------|---------------------------------------|
| id              | UUID          | Primary key                           |
| buyer_id        | UUID          | Foreign key to profiles               |
| book_id         | UUID          | Foreign key to books                  |
| amount          | DECIMAL(10,2) | Purchase amount                       |
| created_at      | TIMESTAMP     | Creation timestamp                    |
| status          | TEXT          | Purchase status                       |

## Relationships

- **profiles.user_id** references Supabase Auth users
- **books.seller_id** references profiles.id
- **books.category_id** references categories.id
- **cart.user_id** references profiles.id
- **cart.book_id** references books.id
- **purchases.buyer_id** references profiles.id
- **purchases.book_id** references books.id

## Authentication Flow

EduBridge implements a flexible authentication system with Supabase Auth that supports:

1. **Email/Password Authentication**: Traditional signup and login
2. **Social Authentication**: Login with Google and GitHub
3. **Anonymous Authentication**: Browse as a guest with limited access

### Anonymous vs. Authenticated Users

- **Anonymous Users**:
  - Created with randomly generated credentials
  - Marked with `is_anonymous: true` in user metadata
  - Have read-only access to browse books
  - Prompted to create an account for protected features

- **Authenticated Users**:
  - Full access to all features
  - Can list books for sale
  - Can purchase books
  - Can manage their profile and listings

### Protected Feature Access

The application implements a context-aware authentication flow:

1. When an anonymous user attempts to access a protected feature (e.g., purchasing a book)
2. They are redirected to the login page with context information
3. A message explains why they need to log in
4. After authentication, they are redirected back to the original feature

## Security Implementation

The application implements several security best practices:

1. **Row-Level Security (RLS)**: Supabase RLS policies restrict data access based on user roles
2. **Access Control**:
   - Anonymous users have limited, read-only access
   - Users can only modify their own data (profiles, listings, cart)
   - Protected routes require authentication
3. **Data Validation**: Input validation on both client and server sides
4. **Secure Authentication**: Leveraging Supabase Auth for secure token-based authentication

## Setup and Installation

1. **Prerequisites**:
   - Node.js (v14 or higher)
   - npm or yarn
   - Supabase account

2. **Environment Setup**:
   - Clone the repository
   - Create a `.env` file with Supabase credentials:
     ```
     REACT_APP_SUPABASE_URL=your_supabase_url
     REACT_APP_SUPABASE_KEY=your_supabase_anon_key
     ```

3. **Database Setup**:
   - Run the SQL scripts in the `sql` directory in your Supabase SQL Editor
   - The `create_tables.sql` script will create all necessary tables with proper relationships

4. **Install Dependencies**:
   ```
   npm install
   ```

5. **Run the Application**:
   ```
   npm start
   ```

## Project Structure

```
edubridge/
├── public/                 # Static files
├── sql/                    # SQL scripts for Supabase setup
├── src/
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Library code and utilities
│   ├── pages/              # Page components
│   ├── services/           # Service modules for API calls
│   ├── styles/             # CSS styles
│   ├── App.js              # Main application component
│   └── index.js            # Application entry point
└── .env                    # Environment variables
```

## API and Services

The application uses several service modules to interact with the Supabase backend:

- **profileService**: Manages user profiles
- **bookService**: Handles book listings and queries
- **cartService**: Manages shopping cart operations
- **authService**: Handles authentication and user management

These services provide a clean abstraction over the Supabase API and ensure consistent data handling throughout the application.
