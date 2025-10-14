import express from 'express';
import {
    getOrders,
    getOrderById,
    getOrderBySessionId,
    createOrder,
    updateOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Get all orders for a user (query by email)
router.get('/', getOrders);

// Get order by session ID
router.get('/session/:sessionId', getOrderBySessionId);

// Get single order by ID
router.get('/:id', getOrderById);

// Create new order
router.post('/', createOrder);

// Update order
router.put('/:id', updateOrder);

export default router;