const jwt = require('jsonwebtoken')
const User = require('../models/user')
//I feel there is no use of this
const verifyUser = async (req, res, next) => {
    const token = req.headers['authorization']

    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'No token provided, access denied'
        })
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET)
        const user = await User.findById(decoded._id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found, authorization failed'
            })
        }

        req.user = decoded;//Storing user data in req.user so when following middleware need it, it no need to decode it again good practice, saves processing currently i don't know we require this or not
        next()
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token, authorization failed'
        })
    }
}


module.exports = verifyUser