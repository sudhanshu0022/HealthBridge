import jwt from 'jsonwebtoken';

// Middleware to verify user token
const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: "Not Authorized. Login Again." });
        }
        
        // Verify token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add userId to request body
        if (!req.body) {
            req.body = {};
        }
        req.body.userId = token_decode.id;
        
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default authUser;
