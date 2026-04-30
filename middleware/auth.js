{/*import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader || authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }
        req.user = user;
        next();
    } catch (err) {
        console.error('JWT verification failed:', err);
        res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    
    }
}*/}

import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export default async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    // 1. CHECK: If header is missing or doesn't start with "Bearer ", reject it
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No token provided"
        });
    }

    // 2. EXTRACT: Get the token string (remove "Bearer ")
    const token = authHeader.split(" ")[1];

    try {
        // 3. VERIFY: Use the secret from your .env file
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. FIND: Get the user from DB (excluding password for security)
        const user = await User.findById(decoded.id).select("-password");
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // 5. ATTACH: Put the user object in the request for the next function to use
        req.user = user;
        next();
        
    } catch (err) {
        console.error('JWT verification failed:', err.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}