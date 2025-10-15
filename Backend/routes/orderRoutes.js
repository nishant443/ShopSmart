import express from 'express';
import {
    verifyPayment,
    getOrders,
    getOrderById,
    getOrderBySessionId,
    createCheckoutSession,
    createOrder,
    updateOrder
} from '../controllers/orderController.js';

import { protect, admin } from '../middleware/auth.js';

import { handleWebhook } from '../controllers/paymentController.js';

const router = express.Router();

// Webhook route (must be before express.json() middleware)
router.post('/webhook', handleWebhook);

// Verify payment route - THIS IS THE ONE YOU NEED
// Verify payment by sessionId (keeps public so checkout redirect works)
router.get('/verify-payment/:sessionId', verifyPayment);

// Other routes

// Protected routes - only authenticated users may access orders
router.get('/', protect, getOrders);
router.get('/session/:sessionId', protect, getOrderBySessionId); // require auth to view order by session
router.get('/:id', protect, getOrderById);
router.post('/checkout', protect, createCheckoutSession);
router.post('/', protect, createOrder);
// Only admins should be able to update orders
router.put('/:id', protect, admin, updateOrder);

export default router;