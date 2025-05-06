import express from 'express';
import { isAdmin, isAuthenticated } from '../middleware/authMiddleware.js';
import {
    getDashboardStats,
    getRecentActivities,
    getUserStats,
    getQuizStats,
    getUsers,
    updateUserRole,
    deleteUser
} from '../controllers/adminController.js';

const router = express.Router();

// Dashboard routes
router.get('/stats', isAuthenticated, isAdmin, getDashboardStats);
router.get('/recent-activities', isAuthenticated, isAdmin, getRecentActivities);
router.get('/user-stats', isAuthenticated, isAdmin, getUserStats);
router.get('/quiz-stats', isAuthenticated, isAdmin, getQuizStats);

// User management routes
router.get('/users', isAuthenticated, isAdmin, getUsers);
router.patch('/users/:userId/role', isAuthenticated, isAdmin, updateUserRole);
router.delete('/users/:userId', isAuthenticated, isAdmin, deleteUser);

export default router; 