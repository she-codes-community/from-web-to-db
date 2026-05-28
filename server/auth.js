import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "./mongomodels/user.js";

/******************** bcrypt password hashing functions ********************/
export async function hashPassword(password) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

export async function comparePassword(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}

/******************** Token related middleware and functions ********************/
export function createToken(user) {
    return jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
}

// Authentication middleware
export async function auth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "Missing Authorization header" });

    const [, token] = header.split(" ");
    if (!token) return res.status(401).json({ error: "Missing token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) return res.status(401).json({ error: "User not found" });

        req.userId = user._id;
        req.userRole = user.role;

        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

// Authorization middleware
export function requireRole(role) {
    return function (req, res, next) {
        if (!req.userRole) {
            return res.status(401).json({ error: "User role missing" });
        }

        if (req.userRole !== role) {
            return res.status(403).json({ error: "Forbidden – insufficient permissions" });
        }

        next();
    };
}


export function validateEmailAndPassword(body) {
    let { email, password } = body;

    if (!email || !password) {
        throw new Error("EMAIL_PASSWORD_REQUIRED");
    }

    email = email.trim().toLowerCase();

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        throw new Error("INVALID_EMAIL");
    }

    if (password.length < 6) {
        throw new Error("PASSWORD_TOO_SHORT");
    }

    return { email, password };
}
