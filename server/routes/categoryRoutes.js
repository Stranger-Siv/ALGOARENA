import express from 'express';
import { 
    getCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    getCategoryStats 
} from '../controllers/categoryController.js';
import { verifyToken } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/adminAuth.js';

const router = express.Router();

router.get('/', getCategories);

router.get('/stats', verifyToken, isAdmin, getCategoryStats);
router.post('/', verifyToken, isAdmin, createCategory);
router.put('/:id', verifyToken, isAdmin, updateCategory);
router.delete('/:id', verifyToken, isAdmin, deleteCategory);

export default router; 