import express from 'express';
import {
    createCheckoutSession,
    handleWebhook,
    verifySession
} from '../controllers/paymentController.js';

const router = express.Router();

// Create Stripe checkout session
router.post('/create-checkout-session', createCheckoutSession);

// Stripe webhook endpoint
// IMPORTANT: Must use raw body parser for webhooks
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Verify payment session
router.get('/verify-session/:sessionId', verifySession);

export default router;