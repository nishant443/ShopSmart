import stripe from '../config/stripe.js';
import Order from '../models/Order.js';

// @desc    Create Stripe checkout session
// @route   POST /api/create-checkout-session
// @access  Public
export const createCheckoutSession = async (req, res) => {
    try {
        const { cartItems, email } = req.body;

        // Validate input
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Calculate total
        const totalAmount = cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        // Create line items for Stripe
        const lineItems = cartItems.map(item => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name,
                    images: [item.image],
                    description: item.description || ''
                },
                unit_amount: Math.round(item.price * 100) // Convert to paise
            },
            quantity: item.quantity
        }));

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/failure`,
            customer_email: email,
            line_items: lineItems,
            metadata: {
                email,
                cartData: JSON.stringify(cartItems),
                totalAmount: totalAmount.toString()
            }
        });

        res.json({
            success: true,
            url: session.url,
            sessionId: session.id
        });

    } catch (error) {
        console.error('Stripe checkout error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Handle Stripe webhook
// @route   POST /api/webhook
// @access  Public (Stripe only)
export const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        // Verify webhook signature (only if webhook secret is set)
        if (process.env.STRIPE_WEBHOOK_SECRET) {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } else {
            // For development without webhook secret
            event = req.body;
        }

        // Handle the event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            // Extract cart data from metadata
            const cartItems = JSON.parse(session.metadata.cartData);
            const totalAmount = parseFloat(session.metadata.totalAmount);

            // Create order in database
            const order = await Order.create({
                email: session.customer_email || session.metadata.email,
                items: cartItems,
                totalAmount,
                paymentStatus: 'Completed',
                stripeSessionId: session.id,
                stripePaymentId: session.payment_intent
            });

            console.log('✅ Order created:', order._id);

            // Optional: Send confirmation email here
        }

        res.json({ received: true });

    } catch (error) {
        console.error('Webhook error:', error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
};

// @desc    Verify payment session
// @route   GET /api/verify-session/:sessionId
// @access  Public
export const verifySession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        // Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        res.json({
            success: true,
            data: {
                paymentStatus: session.payment_status,
                customerEmail: session.customer_email,
                amountTotal: session.amount_total / 100 // Convert from paise to rupees
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};