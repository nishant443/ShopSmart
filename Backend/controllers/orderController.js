import Order from '../models/Order.js';

// @desc    Get all orders for a user
// @route   GET /api/orders?email=user@example.com
// @access  Public
export const getOrders = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const orders = await Order.find({ email }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get order by session ID
// @route   GET /api/orders/session/:sessionId
// @access  Public
export const getOrderBySessionId = async (req, res) => {
    try {
        const order = await Order.findOne({ stripeSessionId: req.params.sessionId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
    try {
        // Validate required fields
        const { email, items, totalAmount } = req.body;
        
        if (!email || !items || !Array.isArray(items) || items.length === 0 || !totalAmount) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: email, items (array), totalAmount'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Validate items structure
        for (const item of items) {
            if (!item.name || !item.price || !item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Each item must have name, price, and quantity'
                });
            }
            if (item.quantity < 1 || item.price < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Quantity must be at least 1 and price cannot be negative'
                });
            }
        }

        if (totalAmount < 0) {
            return res.status(400).json({
                success: false,
                message: 'Total amount cannot be negative'
            });
        }

        const order = await Order.create(req.body);

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};