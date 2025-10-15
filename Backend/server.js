import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS Configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// ⚠️ CRITICAL: Webhook route MUST be BEFORE express.json()
// Import the webhook handler directly
import { handleStripeWebhook } from './controllers/orderController.js';

app.post(
    '/api/orders/webhook',
    express.raw({ type: 'application/json' }),
    handleStripeWebhook
);

// Body parser middleware for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (after express.json)
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'ShopSmart API is running',
        version: '1.0.0',
        endpoints: {
            products: '/api/products',
            orders: '/api/orders',
            checkout: '/api/orders/checkout',
            verifyPayment: '/api/orders/verify-payment/:sessionId'
        }
    });
});

// 404 handler
app.use((req, res) => {
    console.log('❌ 404 - Route not found:', req.method, req.originalUrl);
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
    console.log(`\n📋 Available routes:`);
    console.log(`   GET  /`);
    console.log(`   GET  /api/products`);
    console.log(`   POST /api/orders/checkout`);
    console.log(`   POST /api/orders/webhook`);
    console.log(`   GET  /api/orders/verify-payment/:sessionId`);
    console.log(`   GET  /api/orders/session/:sessionId`);
    console.log(`   GET  /api/orders?email=user@example.com`);
    console.log(`   GET  /api/orders/:id`);
    console.log(`   POST /api/orders`);
    console.log(`   PUT  /api/orders/:id\n`);
});