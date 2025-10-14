import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        image: String
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    stripeSessionId: {
        type: String,
        unique: true,
        sparse: true
    },
    stripePaymentId: {
        type: String
    },
    orderStatus: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    shippingAddress: {
        name: String,
        address: String,
        city: String,
        postalCode: String,
        country: String
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;