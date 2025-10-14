import Stripe from 'stripe';

// Check if Stripe secret key is provided
if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('⚠️  STRIPE_SECRET_KEY not found in environment variables');
    console.warn('⚠️  Please create a .env file with your Stripe configuration');
    console.warn('⚠️  For now, using a placeholder key (payment features will not work)');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key');

export default stripe;