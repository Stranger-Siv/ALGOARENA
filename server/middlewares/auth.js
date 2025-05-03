import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        // Log full request cookies for debugging
        console.log('Cookies received:', req.cookies);
        
        if (!req.cookies) {
            console.log('No cookies object found in request');
            return res.status(401).json({ 
                message: "Please login first",
                error: "NO_COOKIES"
            });
        }

        const token = req.cookies.token;
        console.log('Token from cookie:', token ? 'Found' : 'Not found');

        if (!token) {
            return res.status(401).json({ 
                message: "Please login first",
                error: "NO_TOKEN"
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            req.user = decoded;
            console.log('Token verified successfully for user:', decoded.userId);
            next();
        } catch (jwtError) {
            console.error("JWT Verification Error:", jwtError.message);
            
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    message: "Token has expired, please login again",
                    error: "TOKEN_EXPIRED"
                });
            }
            
            return res.status(401).json({
                message: "Invalid token, please login again",
                error: "INVALID_TOKEN"
            });
        }
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(500).json({
            message: "Internal server error during authentication",
            error: "AUTH_ERROR"
        });
    }
};
