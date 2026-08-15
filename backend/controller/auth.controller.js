import userModel from '../model/user.model.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../lib/utlis.js';


async function signUp(req, res) {
    const { fullName, username, email, password } = req.body;

    try {
        if (!fullName || !username || !email || !password) {
            return res.json({
                success: false,
                message: 'Please fill in all fields'
            });
        }

        // Check if email already taken
        const existingEmail = await userModel.findOne({ email });
        if (existingEmail) {
            return res.json({
                success: false,
                message: 'Email already in use'
            });
        }

        // Check if username already taken
        const existingUsername = await userModel.findOne({ username: username.toLowerCase().trim() });
        if (existingUsername) {
            return res.json({
                success: false,
                message: 'Username already taken'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = await userModel.create({
            fullName, username: username.toLowerCase().trim(), email, password: hash
        });

        const token = generateToken(newUser._id);

        res.json({
            success: true,
            userData: newUser,
            token,
            message: 'User created successfully'
        });
    } catch (err) {
        console.log(err.message);
        res.json({
            success: false,
            message: err.message
        });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const userData = await userModel.findOne({ email });

        if (!userData) {
            return res.json({
                success: false,
                message: 'User not exists'
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect) {
            return res.json({
                success: false,
                message: 'Incorrect Password'
            });
        }

        const token = generateToken(userData._id);

        res.json({
            success: true,
            userData,
            token,
            message: 'Login successful'
        });

    } catch (err) {
        console.log(err.message);
        res.json({
            success: false,
            message: err.message
        });
    }
}

// Controller to check if user is authenticated
function checkAuth(req, res) {
    res.json({
        success: true,
        user: req.user
    });
}

export { signUp, login, checkAuth };