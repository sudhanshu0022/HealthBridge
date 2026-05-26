import jwt from 'jsonwebtoken';

// Middleware to verify admin token
const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers;
        if (!atoken) {
            return res.json({ success: false, message: "Not Authorized. Login Again." });
        }
        
        // Verify token
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
        
        // Check if token payload matches admin credentials format
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "Not Authorized. Login Again." });
        }
        
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default authAdmin;
