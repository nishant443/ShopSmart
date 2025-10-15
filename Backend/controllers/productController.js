// ============================================
// Product Controller
// ============================================

import Product from '../models/Product.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format'
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category, stock } = req.body;

        if (!name || !description || !price || !image || !category) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, description, price, image, category'
            });
        }

        if (price < 0 || (stock !== undefined && stock < 0)) {
            return res.status(400).json({
                success: false,
                message: 'Price and stock cannot be negative'
            });
        }

        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format'
            });
        }

        if (req.body.price !== undefined && req.body.price < 0) {
            return res.status(400).json({
                success: false,
                message: 'Price cannot be negative'
            });
        }

        if (req.body.stock !== undefined && req.body.stock < 0) {
            return res.status(400).json({
                success: false,
                message: 'Stock cannot be negative'
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format'
            });
        }

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Seed sample products
// @route   POST /api/products/seed
// @access  Public (remove in production)
export const seedProducts = async (req, res) => {
    try {
        await Product.deleteMany({});

        const sampleProducts = [
            {
                name: 'Wireless Headphones',
                description: 'High-quality wireless headphones with active noise cancellation and 30-hour battery life',
                price: 2999,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
                category: 'Electronics',
                stock: 50,
                rating: 4.5,
                numReviews: 120
            },
            {
                name: 'Smart Watch Pro',
                description: 'Feature-rich smartwatch with fitness tracking, heart rate monitor, and GPS',
                price: 4999,
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
                category: 'Electronics',
                stock: 30,
                rating: 4.7,
                numReviews: 85
            },
            {
                name: 'Premium Cotton T-Shirt',
                description: 'Comfortable 100% cotton t-shirt for everyday wear, available in multiple colors',
                price: 499,
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
                category: 'Clothing',
                stock: 100,
                rating: 4.0,
                numReviews: 200
            },
            {
                name: 'Modern Web Development Guide',
                description: 'Complete guide to modern web development with React, Node.js, and MongoDB',
                price: 799,
                image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
                category: 'Books',
                stock: 75,
                rating: 4.8,
                numReviews: 150
            },
            {
                name: 'Automatic Coffee Maker',
                description: 'Programmable coffee maker with built-in grinder and thermal carafe',
                price: 3499,
                image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
                category: 'Home',
                stock: 40,
                rating: 4.4,
                numReviews: 95
            },
            {
                name: 'Premium Yoga Mat',
                description: 'Non-slip yoga mat with extra cushioning and carrying strap included',
                price: 899,
                image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
                category: 'Sports',
                stock: 60,
                rating: 4.6,
                numReviews: 180
            },
            {
                name: 'Running Shoes',
                description: 'Lightweight running shoes with excellent cushioning and breathable mesh',
                price: 2499,
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
                category: 'Sports',
                stock: 80,
                rating: 4.3,
                numReviews: 210
            },
            {
                name: 'Wireless Mouse',
                description: 'Ergonomic wireless mouse with precision tracking and long battery life',
                price: 799,
                image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
                category: 'Electronics',
                stock: 120,
                rating: 4.2,
                numReviews: 95
            }
        ];

        const products = await Product.insertMany(sampleProducts);

        res.status(201).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};