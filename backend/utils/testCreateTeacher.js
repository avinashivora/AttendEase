const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('../models/user'); // Adjust path if needed

// Connect to MongoDB
mongoose.connect("mongodb://0.0.0.0:27017/attendance-v1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const updateUserPassword = async () => {
    try {
        const newPassword = 'somaiya';

        // Find the user by email
        // const user = await User.find({});
        // if (!user) {
        //     console.log('User not found');
        //     return;
        // }

        // Generate a new salt
        const salt = makeSalt();
        // Hash the new password with the generated salt
        const hashedPassword = encryptPassword(newPassword, salt);

        // user.forEach((User) => newUsers.push({email: User.email}))

        await User.updateMany({}, {"$set":{hashed_password:hashedPassword, salt:salt}})
        console.log('Password updated successfully');
        // console.log('Updated User:', user);

    } catch (err) {
        console.error('Error updating password:', err);
    } finally {
        mongoose.connection.close(); // Close the connection after the operation
        process.exit();
    }
};

// Helper function to generate salt
function makeSalt() {
    return Math.round(new Date().valueOf() * Math.random()) + '';
}

// Helper function to hash the password
function encryptPassword(password, salt) {
    if (!password) return '';
    try {
        return crypto
            .createHmac('sha1', salt)
            .update(password)
            .digest('hex');
    } catch (err) {
        return '';
    }
}

// Call the function to update the user password
updateUserPassword();
