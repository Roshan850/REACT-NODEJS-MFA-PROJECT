import bcrypt from "bcryptjs";
import User from "../models/user.js";  

export const register = async (req, res) => { 
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            isMfaActivate: false,
        });
        await newUser.save();
        res.status(201).json({ message: "User Registered Successfully ✅" });
    }
    catch (error) {
        res.status(500).json({
            message: "Server Error Registration", username: req.body.username,
            isMfaActivate:req.body.isMfaActivate,
         });
        
    }
};
export const login = async (req, res) => { 
    console.log("User logged in:", req.user);
    res.status(200).json({ message: "User Logged In Successfully ✅", });
};
export const authStatus = async (req,res) => { };
export const logout = async (req,res) => { };
export const setup2FA = async (req,res) => { };
export const verify2FA = async (req,res) => { };
export const reset2FA = async (req,res) => { };
