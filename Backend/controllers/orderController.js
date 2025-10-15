import 'dotenv/config';
import Order from '../models/Order.js';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Handle Stripe webhook events
// @route   POST /api/orders/webhook
// @access  Public
export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('⚠️ Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                console.log('✅ Payment successful for session:', session.id);

                const order = await Order.findOne({ stripeSessionId: session.id });

                if (order) {
                    order.paymentStatus = 'completed';
                    order.orderStatus = 'processing';
                    order.stripePaymentId = session.payment_intent;
                    await order.save();
                    console.log('✅ Order updated:', order._id);
                } else {
                    console.error('❌ Order not found for session:', session.id);
                }
                break;

            case 'payment_intent.payment_failed':
                const failedIntent = event.data.object;
                console.log('❌ Payment failed:', failedIntent.id);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('❌ Webhook handler error:', error);
        res.status(500).json({ error: 'Webhook handler failed' });
    }
};

// @desc    Verify payment and get order details
// @route   GET /api/orders/verify-payment/:sessionId
// @access  Public
export const verifyPayment = async (req, res) => {
    try {
        const { sessionId } = req.params;

        console.log('🔍 Verifying payment for session:', sessionId);

        // Get Stripe session
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        // Find order in database
        const order = await Order.findOne({ stripeSessionId: sessionId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update order if payment was successful
        if (session.payment_status === 'paid' && order.paymentStatus !== 'completed') {
            order.paymentStatus = 'completed';
            order.orderStatus = 'processing';
            order.stripePaymentId = session.payment_intent;
            await order.save();
            console.log('✅ Order updated to completed:', order._id);
        }

        res.json({
            success: true,
            data: {
                order,
                session: {
                    id: session.id,
                    payment_status: session.payment_status,
                    customer_email: session.customer_email
                }
            }
        });

    } catch (error) {
        console.error('❌ Verify payment error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

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

// @desc    Create Stripe checkout session
// @route   POST /api/orders/checkout
// @access  Public
export const createCheckoutSession = async (req, res) => {
    try {
        const { email, items, shippingAddress } = req.body;

        console.log('📦 Checkout Request:', { email, itemCount: items?.length, shippingAddress });

        // Validate required fields
        if (!email || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: email, items (array)'
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

        // Calculate total amount
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create Stripe line items
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : [],
                    description: item.description || ''
                },
                unit_amount: Math.round(item.price * 100) // Convert to paise
            },
            quantity: item.quantity
        }));

        console.log('💳 Creating Stripe session...');

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/checkout`,
            customer_email: email,
            metadata: {
                email,
                shippingAddress: JSON.stringify(shippingAddress || {}),
                itemCount: items.length.toString()
            }
        });

        console.log('✅ Stripe session created:', session.id);

        // FIXED: Changed 'status' to 'orderStatus'
        const order = await Order.create({
            email,
            items,
            totalAmount,
            shippingAddress,
            orderStatus: 'pending',  // FIXED: was 'status'
            stripeSessionId: session.id,
            paymentStatus: 'pending'
        });

        console.log('✅ Order created in DB:', order._id);

        res.status(200).json({
            success: true,
            sessionId: session.id,
            url: session.url,
            orderId: order._id
        });

    } catch (error) {
        console.error('❌ Stripe Checkout Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create checkout session'
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