# Finance Data Processing and Access Control Backend

A robust and secure backend system built with **Node.js**, **Express**, and **Prisma (PostgreSQL)**. This project implements a comprehensive financial record management system with granular Role-Based Access Control (RBAC), data validation, and aggregated analytics.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- A PostgreSQL database (e.g., Supabase)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Akgisno1/zorvyn.git
cd zorvyn

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and copy the contents from `.env.example`. Replace the placeholder values with your actual database credentials and secrets.

```env
# Example .env structure
DATABASE_URL="postgresql://user:password@host:port/dbname?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:port/dbname"
JWT_SECRET="your-very-secure-secret-key"
PORT=3000
NODE_ENV=development
```

### 4. Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Apply migrations to your database
npx prisma migrate dev --name init
```

### 5. Running the Application
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

---

## 🧪 Testing the API

### Option 1: Swagger Documentation (Recommended)
The project includes interactive API documentation.
1. Start the server.
2. Visit: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
3. **Important Note on Authentication**:
   - Swagger does not store session data.
   - To test protected routes, first use the `POST /api/auth/login` endpoint.
   - Copy the `token` from the response.
   - Click the **"Authorize"** button at the top of the Swagger UI.
   - Paste the token and click **"Authorize"**.

### Option 2: Postman
You can also test the APIs using Postman by importing the endpoints.

---

## 📋 Standardized API Response

All responses from the server follow a consistent structure, including appropriate HTTP status codes and informative messages.

### **Response Format**
```json
{
  "statusCode": 200,      // HTTP status code
  "message": "...",        // Success or general information message
  "data": { ... },         // Response payload (null for errors or empty success)
  "errorMessage": null,    // Detailed error description (if applicable)
  "err": null              // Technical error details (only in development)
}
```

### **Common Status Codes**
| Code | Meaning | When it occurs |
| :--- | :--- | :--- |
| **200** | OK | Request succeeded (GET, PUT, DELETE, PATCH). |
| **201** | Created | Resource was successfully created (POST). |
| **400** | Bad Request | Invalid input, validation failed (Zod error). |
| **401** | Unauthorized | Missing token or invalid credentials. |
| **403** | Forbidden | Role mismatch, inactive account, or ownership violation. |
| **404** | Not Found | The requested resource (User or Record) does not exist. |
| **500** | Server Error | An unexpected internal error occurred. |

---

## 🛠️ API Reference & Testing Guide

This section provides a detailed breakdown of all endpoints and what is required to test them. Use the **Swagger UI** (`/api-docs`) or **Postman** for testing.

### **1. Authentication (Auth)**

#### **`POST /api/auth/login`**
- **Description**: Authenticate a user and receive a JWT token.
- **Required Body**:
  ```json
  {
    "email": "user@test.com",
    "password": "password123"
  }
  ```
- **Testing Tip**: Copy the `token` from the response to authorize subsequent requests.

#### **`POST /api/auth/logout`**
- **Description**: Informs the system of a logout (handled client-side).
- **Security**: Requires `Bearer <token>`.

---

### **2. User Management (Users)**

#### **`POST /api/users/createUser`**
- **Description**: Register a new user in the system.
- **Required Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "ADMIN" // Optional: ADMIN, ANALYST, VIEWER (Default: VIEWER)
  }
  ```

#### **`PATCH /api/users/:id/status`**
- **Description**: (Admin only) Activate or Deactivate a user.
- **Security**: Requires `Bearer <token>` (ADMIN only).
- **Required Param**: `id` (User UUID).
- **Required Body**:
  ```json
  { "status": "INACTIVE" } // Values: ACTIVE, INACTIVE
  ```

---

### **3. Financial Records (Records)**

#### **`POST /api/records`**
- **Description**: Create a new income or expense entry.
- **Security**: Requires `Bearer <token>`.
- **Required Body**:
  ```json
  {
    "amount": 1500.50,
    "type": "INCOME", // Values: INCOME, EXPENSE
    "category": "Salary",
    "date": "2024-03-20",
    "description": "Monthly bonus" // Optional
  }
  ```

#### **`GET /api/records`**
- **Description**: Fetch financial records with optional filters.
- **Security**: Requires `Bearer <token>`.
- **Optional Query Params**:
  - `type`: INCOME/EXPENSE
  - `category`: e.g., "Food"
  - `startDate`: YYYY-MM-DD
  - `endDate`: YYYY-MM-DD
  - `amount`: e.g., 500

#### **`GET /api/records/user/:userId`**
- **Description**: (Admin only) Fetch all records created by a specific user.
- **Required Param**: `userId` (User UUID).

#### **`PUT /api/records/:id`**
- **Description**: Update an existing record.
- **Security**: Requires `Bearer <token>` (**Creator Only**).
- **Required Param**: `id` (Record UUID).
- **Body**: Any record fields you wish to update (amount, type, etc.).

#### **`DELETE /api/records/:id`**
- **Description**: Permanently delete a record.
- **Security**: Requires `Bearer <token>` (**Creator Only**).

---

### **4. Dashboard Summaries (Summary)**

All summary endpoints require `Bearer <token>`.

#### **Global Analytics (ADMIN & ANALYST)**
- `GET /api/summary/total-income`: Aggregated total of all income.
- `GET /api/summary/total-expense`: Aggregated total of all expenses.
- `GET /api/summary/net-balance`: Full breakdown (total, count, income vs expense).
- `GET /api/summary/category`: Grouped totals by category.
- `GET /api/summary/recent`: Last 5 transactions with creator names.
- `GET /api/summary/trends?type=monthly`: Weekly or Monthly growth trends.

#### **Personal Analytics (ADMIN Only)**
- `GET /api/summary/my-total-income`: Admin's own income total.
- `GET /api/summary/my-total-expense`: Admin's own expense total.
- `GET /api/summary/my-net-balance`: Admin's personal balance breakdown.
- `GET /api/summary/my-category`: Admin's personal category-wise totals.
- `GET /api/summary/my-recent`: Admin's last 5 personal transactions.
- `GET /api/summary/my-trends?type=weekly`: Admin's personal weekly/monthly trends.

---

## ✅ Implemented Requirements

Implemented all core and optional requirements:

### 1. User and Role Management
- **Creation**: Secure user registration with password hashing (BcryptJS).
- **Roles**: Implementation of `ADMIN`, `ANALYST`, and `VIEWER` roles.
- **Status Control**: Admins can activate/deactivate users. Inactive users are automatically blocked from logging in.

### 2. Financial Records Management
- **Full CRUD**: Create, Read, Update, and Delete financial entries.
- **Advanced Filtering**: Filter records by `amount`, `type` (INCOME/EXPENSE), `category`, and `date range`.

### 3. Dashboard Summary APIs
- **Aggregated Data**: 12 detailed aggregation endpoints providing:
  - Total Income/Expenses
  - Net Balance
  - Category-wise totals
  - Recent activity (with user details)
  - Monthly/Weekly trends

### 4. Access Control Logic (RBAC)
- **Middleware Protection**: Custom `authenticate` and `authorize` middlewares ensure only authorized users access specific endpoints.
- **Ownership Protection**: Users can only **Update** or **Delete** records they personally created. Even an `ADMIN` cannot modify a record created by another user, ensuring data integrity.

### 5. Validation and Error Handling
- **Schema Validation**: Robust input validation using **Zod** for all request bodies and parameters.
- **Standardized Responses**: All API responses follow a consistent structure:
  ```json
  {
    "statusCode": 200,
    "message": "Success message",
    "data": { ... },
    "errorMessage": null,
    "err": null
  }
  ```

---

## ✨ Extra Features & Thoughtful Additions

Beyond the core requirements, we added several enhancements to improve the system's professional quality:

- **Granular Summary Logic**: Instead of a single summary API, we divided them into 12 specific endpoints (Global vs. Personal).
- **Personal vs. Global Analytics**:
  - `ADMIN` and `ANALYST` can view **Global** summaries (all records in the system).
  - `ADMIN` has exclusive access to **Personal** summaries (`/my-...` endpoints) to track their own financial impact separately.
- **Security Hardening**:
  - **Helmet**: Integrated to secure HTTP headers.
  - **CORS**: Configured for safe cross-origin resource sharing.
- **Logging**: **Morgan** integrated for real-time request logging in the console.
- **Documentation**: Full **Swagger** integration for interactive testing.
- **Clean Architecture**: Followed a modular folder structure (`controllers`, `routes`, `middlewares`, `config`, `utils`) for high maintainability.

---

## 🔐 Role Permissions Summary

| Feature | ADMIN | ANALYST | VIEWER |
| :--- | :---: | :---: | :---: |
| Create Users | ✅ | ❌ | ❌ |
| Change User Status | ✅ | ❌ | ❌ |
| View All Records | ✅ | ✅ | ✅ |
| Create Records | ✅ | ✅ | ✅ |
| Update/Delete Records | ✅ (Own Only) | ✅ (Own Only) | ✅ (Own Only) |
| Global Summaries | ✅ | ✅ | ❌ |
| Personal Summaries | ✅ | ❌ | ❌ |
