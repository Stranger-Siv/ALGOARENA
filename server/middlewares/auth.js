import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // Get token directly from request query, body, or cookies
    const token = req.query.token || req.body.token || req.cookies.token;

    if (!token) {
      return res.status(401).json({ 
        message: "Please login first",
        error: "NO_TOKEN"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      message: "Please login again",
      error: "INVALID_TOKEN"
    });
  }
};
