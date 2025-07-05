# Wallet Management System

A full-stack wallet management system built with Angular 18, Node.js (Express.js), Sequelize ORM, and MySQL. Supports wallet creation, credit/debit transactions, and a transaction history table with CSV export and sorting.

Hosted on Vercel (frontend), Railway (backend + MySQL)

🔗 **Live App**: [https://wallet-ui-smoky.vercel.app](https://wallet-ui-smoky.vercel.app)
🔗 **API Base URL**: [https://walletsystem-production.up.railway.app](https://walletsystem-production.up.railway.app)

GitHub Repository: [Edwardjebaraj/wallet\_system](https://github.com/Edwardjebaraj/wallet_system)

---

## 🚀 Features

* Wallet creation with initial balance
* Credit/Debit transaction form
* Transaction history table with pagination, sorting, and CSV export
* REST API built with Node.js, Express.js, Sequelize

---

## 🧱 Tech Stack

* **Frontend**: Angular 18
* **Backend**: Node.js, Express.js
* **ORM**: Sequelize
* **Database**: MySQL (hosted on Railway)
* **Deployment**: Vercel (frontend), Railway (backend + MySQL)

---

## 🧪 API Endpoints

### 📌 POST `/setup`

Create a new wallet.

**Request Body:**

```json
{
  "name": "Edward",
  "balance": 100.50
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "Edward",
  "balance": 100.50,
  "date": "2025-07-05T16:44:30.000Z"
}
```

---

### 📌 POST `/transact/:walletId`

Credit or debit an existing wallet.

**Request Params:**

* `walletId`: string (UUID)

**Request Body:**

```json
{
  "amount": 25.00,          // use negative for debit
  "description": "Top-up"
}
```

**Response:**

```json
{
  "transactionId": "uuid",
  "balance": 125.50
}
```

---

### 📌 GET `/wallet/:walletId`

Retrieve wallet details.

**Request Params:**

* `walletId`: string (UUID)

**Response:**

```json
{
  "id": "uuid",
  "name": "Edward",
  "balance": 125.50,
  "date": "2025-07-05T16:44:30.000Z"
}
```

---

### 📌 GET `/transactions?walletId=uuid&skip=0&limit=10`

Fetch paginated transactions for a wallet.

**Query Params:**

* `walletId`: string (UUID)
* `skip`: number (offset)
* `limit`: number (page size)

**Response:**

```json
[
  {
    "id": "txn-uuid",
    "walletId": "uuid",
    "amount": 25.00,
    "balance": 125.50,
    "description": "Top-up",
    "type": "CREDIT",
    "date": "2025-07-05T17:00:00.000Z"
  },
  ...
]
```

---

## 📝 License

MIT

---

## 👨‍💻 Author

* Edward Jebaraj — [GitHub](https://github.com/Edwardjebaraj)

Need help? Open an issue or contact the maintainer.
