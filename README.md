# Finance Data Processing and Access Control Backend

A robust backend system built with Node.js, Express, and Prisma (PostgreSQL) for managing financial records with role-based access control.

## 🚀 Features

-   **User & Role Management**: Create users with specific roles (`ADMIN`, `ANALYST`, `VIEWER`).
-   **Authentication**: Secure login and logout using JWT.
-   **Financial Records**: Full CRUD operations for transactions (income/expense).
-   **Dashboard Summary**: 12 detailed aggregation endpoints for total income, expenses, net balance, and trends (Global and Personal).
-   **Role-Based Access Control (RBAC)**: Granular permissions for each role.
-   **Ownership Protection**: Users (Admins) can only update or delete records they personally created. Other Admins cannot modify them.
-   **Account Status Control**: Admins can activate or deactivate users. Inactive users are blocked from logging in.
-   **Input Validation**: Robust schema-based validation using Zod.
-   **Standardized API Responses**: Consistent JSON structure for all responses.
-   **Global Error Handling**: Centralized error management for reliability.

## 🔐 Test Credentials

Use these pre-created accounts to test the system:

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin1@test.com` | `password123` | Full access, creator of 5 records. |
| **ADMIN** | `admin2@test.com` | `password123` | Full access, creator of 5 different records. |
| **ANALYST** | `analyst1@test.com` | `password123` | Can view all records and public summaries. |
| **VIEWER** | `viewer1@test.com` | `password123` | Restricted access (can't view summaries). |

## 🛠️ Tech Stack

-   **Runtime**: Node.js (ES Modules)
-   **Framework**: Express.js
-   **ORM**: Prisma
-   **Database**: PostgreSQL (Supabase)
-   **Validation**: Zod
-   **Security**: Helmet, CORS, BcryptJS, JWT
-   **Logging**: Morgan

## 📋 API Response Format

All responses follow this structure:

```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": { ... },
  "errorMessage": "Error description",
  "err": { ... catch error object ... }
}
```

## 🔐 Role Permissions

| Feature | ADMIN | ANALYST | VIEWER |
| :--- | :--- | :--- | :--- |
| Create Users | ✅ | ❌ | ❌ |
| Change User Status | ✅ | ❌ | ❌ |
| Create Records | ✅ | ✅ | ✅ |
| Update/Delete Records | ✅ (Own Only) | ✅ (Own Only) | ✅ (Own Only) |
| Public Summaries | ✅ | ✅ | ❌ |
| Personal Summaries | ✅ | ❌ | ❌ |

## 🛠️ Setup Instructions

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd zorvyn
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="postgresql://postgres.[ID]:[PASSWORD]@aws-1-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
    DIRECT_URL="postgresql://postgres.[ID]:[PASSWORD]@aws-1-[REGION].pooler.supabase.com:5432/postgres"
    JWT_SECRET="your_secret_key"
    PORT=3000
    ```

4.  **Database Migration**:
    ```bash
    npx prisma generate
    ```

5.  **Start the server**:
    ```bash
    npm run dev
    ```

## 🧪 API Documentation

### **Auth & Users**
- `POST /api/users/createUser`: Register a new user.
- `POST /api/auth/login`: Authenticate and get a JWT token.
- `PATCH /api/users/:id/status`: (Admin only) Activate/Deactivate a user.

### **Financial Records**
- `GET /api/records`: Fetch records with filters (`category`, `type`, `startDate`, `endDate`).
- `POST /api/records`: Create a new record.
- `PUT /api/records/:id`: Update a record (Creator only).
- `DELETE /api/records/:id`: Delete a record (Creator only).

### **Summary (Admin/Analyst)**
- `GET /api/summary/total-income`: Global income total.
- `GET /api/summary/my-total-income`: (Admin only) Personal income total.
- `GET /api/summary/net-balance`: Detailed global balance breakdown.
- `GET /api/summary/trends`: Global weekly/monthly trends.
