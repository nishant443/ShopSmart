# 🛍️ ShopSmart - E-Commerce Platform

> A modern, full-stack e-commerce application with seamless Stripe integration and real-time payment verification

## 🌟 Overview

**ShopSmart** is a production-ready e-commerce demo showcasing best practices in full-stack development. Built with a powerful Node.js + Express + MongoDB backend and a lightning-fast React + Vite frontend, it delivers a smooth shopping experience from browsing to checkout.

### ✨ Key Highlights

- 🎨 Modern, responsive UI with Tailwind CSS
- 💳 Secure Stripe payment integration
- 🔄 Real-time order tracking and verification
- 📦 Efficient cart management with Context API
- 🚀 Optimized performance with Vite
- 🔐 Webhook-based payment confirmation

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Stripe Webhook Setup](#-stripe-webhook-setup)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## ⚙️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Next-generation frontend tooling
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Fast web framework
- **MongoDB** - NoSQL database
- **Mongoose** - Elegant MongoDB ODM
- **Stripe API** - Payment processing

### Development Tools
- **Nodemon** - Auto-restart on file changes
- **ESLint** - Code quality and consistency
- **Stripe CLI** - Local webhook testing

---

## 🎯 Features

### 🛒 Shopping Experience
- ✅ Dynamic product catalog with real-time updates
- ✅ Intuitive cart management (add/remove/update quantities)
- ✅ Persistent cart state across sessions
- ✅ Responsive design for all devices

### 💰 Payment & Orders
- ✅ Secure Stripe Checkout integration
- ✅ Real-time payment verification via webhooks
- ✅ Order confirmation and tracking
- ✅ Order history with detailed information
- ✅ Email-based order lookup

### 🔧 Technical Features
- ✅ RESTful API architecture
- ✅ MongoDB data persistence
- ✅ Error handling and validation
- ✅ CORS configuration for secure cross-origin requests
- ✅ Environment-based configuration

---

## 📁 Project Structure

```
ShopSmart/
│
├── Backend/                          # Express + MongoDB backend
│   ├── config/                       # Configuration files
│   │   ├── db.js                    # MongoDB connection
│   │   └── stripe.js                # Stripe configuration
│   │
│   ├── controllers/                  # Business logic
│   │   ├── productController.js     # Product operations
│   │   └── orderController.js       # Order & payment logic
│   │
│   ├── models/                       # Mongoose schemas
│   │   ├── Product.js               # Product model
│   │   └── Order.js                 # Order model
│   │
│   ├── routes/                       # API endpoints
│   │   ├── productRoutes.js         # Product routes
│   │   └── orderRoutes.js           # Order & checkout routes
│   │
│   ├── middleware/                   # Custom middleware
│   │   └── errorHandler.js          # Error handling
│   │
│   ├── server.js                     # Main server file
│   ├── package.json                  # Backend dependencies
│   └── .env                          # Environment variables
│
├── frontend/                         # React + Vite frontend
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── ProductCard.jsx      # Product display
│   │   │   ├── CartItem.jsx         # Cart item component
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   └── Footer.jsx           # Footer component
│   │   │
│   │   ├── context/                  # State management
│   │   │   └── CartContext.jsx      # Global cart state
│   │   │
│   │   ├── pages/                    # Application pages
│   │   │   ├── Products.jsx         # Product listing
│   │   │   ├── Cart.jsx             # Shopping cart
│   │   │   ├── Checkout.jsx         # Checkout page
│   │   │   ├── Success.jsx          # Order success
│   │   │   └── Orders.jsx           # Order history
│   │   │
│   │   ├── utils/                    # Utility functions
│   │   │   ├── api.js               # API calls
│   │   │   └── formatters.js        # Data formatting
│   │   │
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Global styles
│   │
│   ├── public/                       # Static assets
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   └── tailwind.config.js           # Tailwind configuration
│
├── .gitignore                        # Git ignore rules
├── .env.example                      # Environment template
└── README.md                         # This file
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (v8 or higher) or **yarn**
- **MongoDB** - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (recommended) or local installation
- **Stripe Account** - [Sign up](https://stripe.com/)
- **Git** - [Download](https://git-scm.com/)

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/ShopSmart.git
cd ShopSmart
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

#### Create Environment File

Create a `.env` file in the `Backend/` directory:

```env
# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/shopsmart?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=development

# Frontend URL
CLIENT_URL=http://localhost:5173

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_*************************
STRIPE_WEBHOOK_SECRET=whsec_*************************
```

#### Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

✅ Backend running at: `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
```

#### Start Development Server

```bash
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Stripe Webhooks (Optional for local testing):**
```bash
stripe listen --forward-to localhost:5000/api/orders/webhook
```

### Access the Application

Open your browser and navigate to:
👉 **http://localhost:5173**

---

## 📡 API Documentation

### Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/products` | Get all products | No |
| `GET` | `/api/products/:id` | Get product by ID | No |

### Orders & Checkout

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/orders/checkout` | Create Stripe checkout session | No |
| `POST` | `/api/orders/webhook` | Stripe webhook endpoint | No |
| `GET` | `/api/orders/verify-payment/:sessionId` | Verify payment status | No |
| `GET` | `/api/orders` | Get all orders (filter by email) | No |
| `GET` | `/api/orders/:id` | Get order by ID | No |

### Example API Request

```javascript
// Create checkout session
const response = await fetch('http://localhost:5000/api/orders/checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    items: [
      { productId: '123', quantity: 2 },
      { productId: '456', quantity: 1 }
    ],
    customerEmail: 'customer@example.com'
  })
});

const { sessionId, url } = await response.json();
// Redirect user to Stripe Checkout
window.location.href = url;
```

---

## 💳 Stripe Webhook Setup

### For Local Development

1. **Install Stripe CLI**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows
   scoop install stripe
   
   # Linux
   # Download from https://github.com/stripe/stripe-cli/releases
   ```

2. **Login to Stripe**
   ```bash
   stripe login
   ```

3. **Forward Webhooks to Local Server**
   ```bash
   stripe listen --forward-to localhost:5000/api/orders/webhook
   ```

4. **Copy Webhook Secret**
   The CLI will display a webhook secret (starts with `whsec_`). Copy this to your `.env` file as `STRIPE_WEBHOOK_SECRET`.

### For Production

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Enter your production webhook URL: `https://yourdomain.com/api/orders/webhook`
4. Select events to listen to: `checkout.session.completed`
5. Copy the signing secret to your production environment variables

---

## 🔐 Environment Variables

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/shopsmart` |
| `PORT` | Backend server port | `5000` |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:5173` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` |

### Security Best Practices

- ⚠️ **Never commit `.env` files** to version control
- ✅ Use `.env.example` to share variable names (without values)
- 🔒 Keep production secrets in secure environment variable managers
- 🔄 Rotate API keys regularly
- 🛡️ Use different Stripe keys for development and production

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Browse products on home page
- [ ] Add products to cart
- [ ] Update product quantities
- [ ] Remove items from cart
- [ ] Proceed to checkout
- [ ] Complete Stripe payment (use test card: `4242 4242 4242 4242`)
- [ ] Verify order confirmation
- [ ] Check order in database

### Stripe Test Cards

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 9995` | Declined payment |
| `4000 0000 0000 3220` | Requires authentication |

Use any future expiry date and any 3-digit CVC.

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. CORS Error

**Problem:** Frontend can't connect to backend

**Solution:**
- Verify `CLIENT_URL` in `.env` matches your frontend URL
- Check that CORS is properly configured in `server.js`

```javascript
// Backend: server.js
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

#### 2. MongoDB Connection Failed

**Problem:** Cannot connect to database

**Solution:**
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas IP whitelist (allow your IP or use `0.0.0.0/0` for development)
- Ensure database user has proper permissions
- Test connection string in MongoDB Compass

#### 3. Stripe Webhook Not Firing

**Problem:** Orders not being created after payment

**Solution:**
- Ensure backend is running
- Verify Stripe CLI is forwarding webhooks
- Check `STRIPE_WEBHOOK_SECRET` matches CLI output
- Look for webhook errors in Stripe Dashboard

#### 4. Module Not Found Errors

**Problem:** Missing dependencies

**Solution:**
```bash
# Backend
cd Backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### 5. Port Already in Use

**Problem:** Port 5000 or 5173 is already occupied

**Solution:**
```bash
# Kill process on port 5000 (macOS/Linux)
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env
```

---

## 📦 Building for Production

### Backend

```bash
cd Backend
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

The optimized production build will be in `frontend/dist/`.

### Deployment Options

- **Backend:** Heroku, Railway, Render, AWS EC2
- **Frontend:** Vercel, Netlify, AWS S3 + CloudFront
- **Database:** MongoDB Atlas (recommended)

---

## 🚀 Future Enhancements

### Planned Features

- [ ] 🔐 User authentication (JWT/OAuth)
- [ ] 👤 User profiles and order history
- [ ] 🔍 Product search and filtering
- [ ] 📊 Admin dashboard for inventory management
- [ ] ⭐ Product reviews and ratings
- [ ] 📧 Email notifications for orders
- [ ] 💾 Wishlist functionality
- [ ] 🏷️ Discount codes and promotions
- [ ] 📱 Mobile app (React Native)
- [ ] 🌍 Multi-language support

### Technical Improvements

- [ ] Add comprehensive unit and integration tests
- [ ] Implement caching with Redis
- [ ] Add rate limiting for API endpoints
- [ ] Set up CI/CD pipeline
- [ ] Implement logging and monitoring
- [ ] Add TypeScript support
- [ ] Optimize images with CDN
- [ ] Implement server-side rendering (SSR)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Steps to Contribute

1. **Fork the repository**
   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/<your-username>/ShopSmart.git
   cd ShopSmart
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add amazing feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Describe your changes

### Contribution Guidelines

- 📝 Follow the existing code style
- ✅ Test your changes thoroughly
- 📚 Update documentation as needed
- 💬 Write clear commit messages
- 🐛 Report bugs with detailed information

---

## 📄 License

This project is currently **unlicensed**. 

### Recommended License

For open-source projects, we recommend the **MIT License**:

```
MIT License

Copyright (c) 2025 ShopSmart

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

To add a license, create a `LICENSE` file in the root directory.

---

## 📞 Support & Contact

### Need Help?

- 📖 Check the [Documentation](#-table-of-contents)
- 🐛 [Report a Bug](https://github.com/<your-username>/ShopSmart/issues)
- 💡 [Request a Feature](https://github.com/<your-username>/ShopSmart/issues)
- 💬 [Join Discussions](https://github.com/<your-username>/ShopSmart/discussions)

### Connect With Us

- 🌐 Website: [your-website.com](#)
- 📧 Email: [contact@shopsmart.com](#)
- 🐦 Twitter: [@ShopSmartApp](#)
- 💼 LinkedIn: [ShopSmart](#)

---

## 🙏 Acknowledgments

- **Stripe** - For excellent payment processing
- **MongoDB** - For reliable database service
- **Vercel** - For hosting and deployment tools
- **React Community** - For amazing ecosystem
- **You** - For using and contributing to ShopSmart!

---

## 📊 Project Status

![Development](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-None-red)

---

<div align="center">

**Made with ❤️ by the ShopSmart Team**

⭐ Star us on GitHub — it motivates us a lot!

[Report Bug](https://github.com/<your-username>/ShopSmart/issues) · [Request Feature](https://github.com/<your-username>/ShopSmart/issues)

</div>

---

**Happy Coding! 🎉**
