🛍️ ShopSmart

ShopSmart is a simple full-stack e-commerce demo built with a Node.js + Express + MongoDB backend and a React + Vite frontend.
It features product listing, a shopping cart, Stripe-powered checkout, order management, and webhook-based payment verification.

📋 Table of Contents

Tech Stack

Features

Project Structure

Environment Variables

Installation & Setup

1. Clone the Repository

2. Backend Setup

3. Frontend Setup

Running the Application

API Overview

Stripe Webhook Setup

Troubleshooting

Contributing

License

⚙️ Tech Stack

Frontend

React (with Vite)

React Router

Tailwind CSS

Backend

Node.js + Express

MongoDB + Mongoose

Stripe API (Checkout + Webhook)

Dev Tools

Nodemon (backend auto-restart)

ESLint (frontend linting)

✨ Features

✅ Product listing (fetched from backend)
✅ Add to Cart / Remove from Cart
✅ Update product quantities
✅ Checkout using Stripe
✅ Payment verification via Webhook
✅ Order confirmation and persistence in MongoDB

🧩 Project Structure
ShopSmart/
│
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
│   │   ├── pages/           # App pages (Products, Checkout, etc.)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── README.md
└── .env.example             # Example environment file

🔐 Environment Variables

Create a .env file inside the Backend/ folder with the following keys:

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/shop
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_*************************
STRIPE_WEBHOOK_SECRET=whsec_*************************


💡 Note:
Never commit this file to version control. You can create .env.example for sharing key names only.

🧰 Installation & Setup
1. Clone the Repository
git clone https://github.com/<your-username>/ShopSmart.git
cd ShopSmart

2. Backend Setup
cd Backend
npm install


Create .env in Backend/ as described above.
Then run the server (choose one):

npm run dev   # Development mode (nodemon)
# or
npm start     # Production mode


Your backend should now run on http://localhost:5000.

3. Frontend Setup

In a new terminal:

cd frontend
npm install
npm run dev


This starts the Vite development server at http://localhost:5173.

🚀 Running the Application

Start the backend (MongoDB + Express):

cd Backend
npm run dev


Start the frontend (React + Vite):

cd frontend
npm run dev


Open your browser at:
👉 http://localhost:5173

📡 API Overview
Method	Endpoint	Description
GET	/api/products	Get all products
POST	/api/orders/checkout	Create Stripe Checkout session
POST	/api/orders/webhook	Stripe webhook for payment verification
GET	/api/orders/verify-payment/:sessionId	Verify payment session
GET	/api/orders	Get orders (optionally by email)
GET	/api/orders/:id	Get order by ID
💳 Stripe Webhook Setup

To test webhooks locally, install the Stripe CLI and run:

stripe login
stripe listen --forward-to localhost:5000/api/orders/webhook


Then set the STRIPE_WEBHOOK_SECRET in your .env to the secret shown in the terminal.

🧠 Troubleshooting

CORS Error?
Ensure CLIENT_URL in .env matches your frontend URL (http://localhost:5173).

MongoDB connection fails?
Verify your MONGO_URI is correct and accessible.

Stripe webhook not firing?
Ensure the backend is running and webhook secret matches the Stripe CLI output.

🤝 Contributing

Pull requests and suggestions are welcome!

Fork this repo

Create your feature branch (git checkout -b feature/new-feature)

Commit your changes (git commit -m "Add feature")

Push to your branch (git push origin feature/new-feature)

Open a Pull Request 🎉

📄 License

This project currently has no license.
If you plan to open source it, add a LICENSE file (MIT recommended).

🧩 Optional Enhancements (Future Scope)

Add authentication (JWT or OAuth)

Implement product search & filtering

Include admin panel for inventory management