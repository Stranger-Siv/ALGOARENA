import User from "../models/User.js";

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        
        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                message: "Admin access required. Please login as admin."
            });
        }
        
        next();
    } catch (error) {
        res.status(500).json({
            message: "Error checking admin rights"
        });
    }
}; 