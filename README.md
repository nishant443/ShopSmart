# 🛍️ ShopSmart — Full-stack E‑commerce Demo

ShopSmart is a compact full‑stack e‑commerce demo built with a Node.js + Express + MongoDB backend and a React + Vite frontend. It demonstrates a complete purchase flow: product listing, cart management, Stripe-powered checkout, webhook payment verification, and order history persisted in MongoDB.

This README is a polished, copy‑ready guide you can drop into the repository root.

---

## 📌 Quick Links
- Frontend: `frontend/`
- Backend: `Backend/`
- Example env file: `.env.example`

---

## ⚙️ Tech Stack
- Frontend: React + Vite, React Router, Tailwind CSS
- Backend: Node.js, Express, MongoDB (Mongoose)
- Payments: Stripe (Checkout + Webhook)
- Dev tools: Nodemon, ESLint

---

## ✨ Features
- Product listing (server API)
- Add / remove / update cart items
- Checkout using Stripe Checkout
- Payment verification via Stripe Webhook
- Orders persisted in MongoDB
- Admin-style endpoints for order retrieval

---

## 📁 Project Structure
```
ShopSmart/
├── Backend/                 # Express + MongoDB backend
│   ├── controllers/         # Business logic for routes
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── config/              # DB and Stripe config
│   ├── server.js            # Main server file
│   └── package.json
│
├── frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Global state (CartContext)
│   │   ├── pages/           # App pages (Products, Checkout, Orders)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── README.md
└── .env.example
```

---

## 🔐 Environment Variables
Create a `.env` file inside the `Backend/` folder and add the following:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/shop
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_*************************
STRIPE_WEBHOOK_SECRET=whsec_*************************
```

> Note: Do NOT commit your `.env` to version control. Provide a `.env.example` instead with only variable names.

---

## 🧰 Installation & Setup

1) Clone the repository
```bash
git clone https://github.com/<your-username>/ShopSmart.git
cd ShopSmart
```

2) Backend
```bash
cd Backend
npm install
# create .env using the variables above
npm run dev   # development (nodemon)
# or
npm start     # production
```
Your backend will run at `http://localhost:5000`.

3) Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Vite dev server runs at `http://localhost:5173`.

---

## 🚀 Running & Testing
1. Start MongoDB (URI in `.env` must be reachable).
2. Start backend and frontend as above.
3. Open: `http://localhost:5173`
4. Browse products, add to cart and proceed to Checkout.
5. Complete payment via Stripe Checkout.

---

## 📡 API Overview
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products |
| POST | /api/orders/checkout | Create a Stripe Checkout session |
| POST | /api/orders/webhook | Stripe webhook for payment verification |
| GET | /api/orders/verify-payment/:sessionId | Verify payment session |
| GET | /api/orders | Get orders (optionally by email) |
| GET | /api/orders/:id | Get order by ID |

---

## 💳 Stripe Webhook (Local Testing)
To test webhooks locally, install the Stripe CLI and run:
```bash
stripe login
stripe listen --forward-to localhost:5000/api/orders/webhook
```
Copy the webhook secret printed by the Stripe CLI and set `STRIPE_WEBHOOK_SECRET` in your Backend `.env`.

---

## 🧠 Troubleshooting
- CORS errors: Ensure `CLIENT_URL` in `.env` matches your Vite origin `http://localhost:5173` and the backend `cors()` is configured.
- MongoDB connection fails: Verify `MONGO_URI` and network connectivity.
- Stripe webhooks not firing: Make sure backend is running and `STRIPE_WEBHOOK_SECRET` matches the Stripe CLI output.

---

## 🤝 Contributing
Contributions welcome:
1. Fork the repo
2. Create a feature branch
3. Commit & push
4. Open a Pull Request

---

## 📄 License
This example currently does not include an open-source license. Add a `LICENSE` file (MIT recommended) before publishing publicly.

---

## 🔮 Roadmap / Enhancements
- Add user auth (JWT)
- Admin dashboard for products & orders
- Product search & filtering
- Email receipts (e.g., using SendGrid)


---

Happy hacking! 🎉
