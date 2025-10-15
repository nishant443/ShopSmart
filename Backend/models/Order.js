import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Please enter a valid email address'
        }
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        name: {
            type: String,
            required: [true, 'Product name is required']
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative']
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1']
        },
        image: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        }
    }],
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: [0, 'Total amount cannot be negative']
    },
    paymentStatus: {
        type: String,
        enum: {
            values: ['pending', 'completed', 'failed', 'refunded'],
            message: '{VALUE} is not a valid payment status'
        },
        default: 'pending',
        lowercase: true
    },
    stripeSessionId: {
        type: String,
        unique: true,
        sparse: true
    },
    stripePaymentId: {
        type: String,
        default: null
    },
    orderStatus: {
        type: String,
        enum: {
            values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            message: '{VALUE} is not a valid order status'
        },
        default: 'pending',
        lowercase: true
    },
    shippingAddress: {
        name: {
            type: String,
            trim: true
        },
        address: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        postalCode: {
            type: String,
            trim: true
        },
        country: {
            type: String,
            trim: true,
            default: 'India'
        }
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Index for faster queries
orderSchema.index({ email: 1, createdAt: -1 });
orderSchema.index({ stripeSessionId: 1 });
orderSchema.index({ orderStatus: 1 });

// Virtual for order total with tax
orderSchema.virtual('totalWithTax').get(function () {
    return this.totalAmount * 1.18; // 18% tax
});

// Method to calculate total from items
orderSchema.methods.calculateTotal = function () {
    return this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
};

// Pre-save middleware to validate total
orderSchema.pre('save', function (next) {
    if (this.isNew && this.items && this.items.length > 0) {
        const calculatedTotal = this.calculateTotal();
        // Allow small rounding differences
        if (Math.abs(calculatedTotal - this.totalAmount) > 1) {
            return next(new Error('Total amount does not match sum of items'));
        }
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;