import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid';
import cookie from 'cookie'

// Function to generate a unique API key
const generateUniqueApiKey = async () => {
    let apiKey;
    let isUnique = false;
    
    while (!isUnique) {
        apiKey = uuidv4();
        const existingUser = await User.findOne({ apiKey });
        if (!existingUser) {
            isUnique = true;
        }
    }
    return apiKey;
}
//generate jwt token
export const generateToken = (user)=>{
    return jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:'15d',
    })
}
//signup controller for user
export const signup = async (req, res) => {
    try {
        const { email, firstname, lastname,photo,password, confirmPassword, gender } = req.body;
        console.log(req.body);

        if (!email || !firstname || !lastname || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "Please enter valid details" });
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long, include small letters, capital letters, and numbers, and must not include spaces."
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password doesn't match" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const apiKey = await generateUniqueApiKey();

        const newUser = new User({
            email,
            firstname,
            lastname,
            photo,
            password: hashPassword,
            apiKey,
            gender
        });

        await newUser.save();
        res.status(200).json({ success: true, message: "User successfully created", apiKey });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

//user login controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please enter the email & password" });
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User does not exist, check the email" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ status: false, message: "Password incorrect" });
        }
        
        const token = generateToken(user)

            const{...rest} = user._doc

            res.setHeader('Set-Cookie', cookie.serialize('jwt', token, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 15, 
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production'
            }));
            res.status(200).json({
                success: true, message: 'Successfully logged in', apiKey: user.apiKey, token, data:{...rest}
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
export const verifyToken = async (req, res) => {
    try {
        const token = req.body.token;
        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
      res.clearCookie('jwt', { path: '/' });
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };