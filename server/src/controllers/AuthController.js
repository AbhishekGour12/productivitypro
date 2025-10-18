import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;
    console.log(username, password)
    try {
        if (!username || !email || !password || !role) {
            return res.status(400).json({ success: false, message: 'Please enter all fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        console.log(hashPassword)
        const user = new User({
            username,
            email,
            password: hashPassword,
            role: role
        })
        await user.save()
        console.log(user)
        if (user) {
            res.status(201).json({
                data: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id),
                },
                message: 'register successfully'
            });

        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
        console.log(err.message)
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;


    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid email' });
            return;

        }

        const hashPassword = await bcrypt.compare(password, user.password);


        if (user && hashPassword) {
            res.json({
                success: true,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id),
                },
                message: "login successfully"

            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid password' });
        }
    } catch (err) {
        res.status(401).json({ success: false, message: err.message });
        console.log(err.message)

    }
};

export { registerUser, loginUser };
