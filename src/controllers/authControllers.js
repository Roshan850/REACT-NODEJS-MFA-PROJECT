import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import jwt from "jsonwebtoken";
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
  } catch (error) {
    res.status(500).json({
      message: "Server Error Registration",
      username: req.body.username,
      isMfaActivate: req.body.isMfaActivate,
    });
  }
};
export const login = async (req, res) => {
  console.log("User logged in:", req.user);
  res.status(200).json({ message: "User Logged In Successfully ✅" });
};
export const authStatus = async (req, res) => {
  if (req.user) {
    res
      .status(200)
      .json({
        message: "User is loged in Successfully ✅ ",
        username: req.user.username,
        isMfaActivate: req.user.isMfaActivate,
      });
    } else {
    res.status(401).json({ message: "User is not logged in ❌" });
  }
};
export const logout = async (req, res) => {
    if(!req.user){
        return res.status(400).json({ message: "No user is logged in ❌" });
    }
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Error logging out ❌" });
        }   
        res.status(200).json({ message: "User Logged Out Successfully ✅" });
    });
};
export const setup2FA = async (req, res) => {
  try {
    console.log("Setting up 2FA for user:", req.user);

    const user = req.user;

    // Generate secret key
    const secret = speakeasy.generateSecret({ length: 20 });
    console.log("Generated secret:", secret);

    // Save to DB
    user.twoFactorSecret = secret.base32;
    user.isMfaActivate = true;
    await user.save();

    // Build otpauth URL for authenticator apps
    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `${req.user.username}`,
      issuer: "www.OmTech.com",
      encoding: "base32",
    });

    console.log("otpauth URL:", url);

    // Generate QR code
    const qrImageUrl = await qrcode.toDataURL(url);

    // ✅ SEND ONLY ONE RESPONSE
    return res.status(200).json({
      message: "2FA Setup Successful ✅",
      secret: secret.base32,
      otpauthUrl: url,
      qrCode: qrImageUrl,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error setting up 2FA ❌" });
  }
};

export const verify2FA = async (req, res) => {
  const { token } = req.body;
  const user = req.user;
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
    window: 1,
  });
  if (verified) {
    const jwtToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );
    res.status(200).json({  
      message: "2FA Verified Successfully ✅",
      token: jwtToken,
    });
  } else {
    res.status(400).json({ message: "Invalid 2FA Token ❌" });
  }
};
export const reset2FA = async (req, res) => {
  try {
    const user = req.user;
    user.twoFactorSecret = null;
    user.isMfaActivate = false;
    await user.save();
    res.status(200).json({ message: "2FA Reset Successfully ✅" });
  } catch (error) {
    res.status(500).json({message: "Error resetting 2FA ❌" });
  }
};
