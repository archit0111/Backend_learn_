# 🏦 Double-Entry Ledger System (Backend API)

A robust, production-ready financial ledger backend system built with **Node.js, Express, MongoDB, and Mongoose**. The application uses a strict **Double-Entry Accounting System** to ensure financial accuracy, features **JWT-based authentication**, **aggregation pipelines for live balance calculation**, and guarantees **transaction idempotency**.

---

## ✨ Features

- **User Authentication:** Secure user signup, login, and logout using JWT stored in HTTP-only cookies/headers.
- **Protected Routes:** Middleware authorization layer for secure access control.
- **Double-Entry Ledger Architecture:** Every transaction creates balanced debit and credit entries, eliminating un-tracked money creation or loss.
- **Idempotent Transactions:** Prevents duplicate financial transfers using an `idempotencyKey` mechanism. Returns status (`pending`, `completed`, or `failed`) on duplicate submission requests.
- **Live Balance via Aggregation Pipelines:** Real-time account balance computed dynamically using optimized MongoDB Aggregation queries rather than relying on stale cached counters.

---

## 🛠 Tech Stack

- **Runtime Environment:** Node.js
- **Web Framework:** Express.js
- **Database:** MongoDB
- **ORM / ODM:** Mongoose
- **Authentication:** JSON Web Tokens (JWT) & bcrypt.js

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed locally:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster URI)

### Installation

1. **Clone the repository:**

   git clone [https://github.com/your-username/double-entry-ledger.git](https://github.com/your-username/double-entry-ledger.git)
   cd double-entry-ledger

2. **Install Dependency:**
    npm install

3. **Configure Environment Variable:**
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/double_entry_ledger
    JWT_SECRET=your_super_secret_jwt_key
    JWT_EXPIRES_IN=1d

4. **Start the Server:**

# Development mode
npm run dev

# Production mode
npm start

---

## Key Architectural Design Concepts

1. Double-Entry Accounting System
Money is never created or destroyed out of thin air. For every transfer:

A Debit entry increases an asset account or decreases a liability.

A Credit entry decreases an asset account or increases a liability.

Both debit and credit sides are executed in an atomic database transaction.

2. Transaction Idempotency
To prevent double-spending or accidental re-submits (e.g., network timeout during payment):

Each transfer requires a unique idempotencyKey.

If a request is sent again with the same idempotencyKey, the system detects the existing transaction record and returns its current status (pending, completed, or failed) without re-processing funds.

3. Balance Calculation via Aggregation Pipeline
Instead of mutating a balance field on the account document (which causes race conditions under heavy concurrent writes), balances are dynamically computed on-demand using MongoDB Aggregation Pipelines:

Balance = Sum of all Credits - Sum of all Debits

