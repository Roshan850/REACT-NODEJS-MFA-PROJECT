import { Router } from "express";

import passport from "passport";
import {
    register,
    login,
    authStatus,
    logout,
    setup2FA,
    verify2FA,
    reset2FA
} from "../controllers/authControllers.js";

const router = Router();

//Registration route
router.post("/register", register);

//Login Route
router.post("/login", passport.authenticate("local"), login);

//Auth Status Route
router.get("/status", authStatus);
// Logout Route
router.post("/logout", logout);

// 2FA Setup Route
router.post("/2fa/setup", (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "User is not logged in ❌" });
}, setup2FA);
// Verify Route
router.post("/2fa/verify", (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "User is not logged in ❌" });
}, verify2FA);
// Reset Route
router.post("/2fa/reset",(req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "User is not logged in ❌" });
}, reset2FA);

export default router;

