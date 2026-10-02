const jwt = require('jsonwebtoken');
const User = require('../models/user')
//Remove previous device button in update student doesn't handles 403 properly
const verifyDevAdmin = async (req, res, next) => {
    const { token } = req.params;
    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'No token provided, access denied'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded._id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found, authorization failed'
            })
        }

        if (user.role !== 2) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admins only'
            })
        }
        req.user = decoded;//Storing user data in req.user so when following middleware need it, it no need to decode it again good practice, saves processing currently i don't know we require this or not
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token, authorization failed'
        });
    }
};

module.exports = verifyDevAdmin;