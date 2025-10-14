import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    seedProducts
} from '../controllers/productController.js';

const router = express.Router();

// IMPORTANT: Seed route must be BEFORE /:id route
router.post('/seed', seedProducts);

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;