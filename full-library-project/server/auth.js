import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mongoose -->
import User from "./mongomodels/user.js";
import { normalizeMongoId } from "./mongodb.js";

// Prisma -->
//import {prisma, toPrismaId} from "./prisma.js";

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
const JWT_SECRET = "library-secret";

export function createToken(user) {
    return jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
    );
}

// Authentication middleware
export async function auth(req, res, next) {
    // Getting the authorization header from the request
    const header = req.headers.authorization;

    // Return 401 if there is no header
    if (!header) {
        return res.status(401).json({error: "Missing Authorization header"});
    }

    // Return 401 if there is no "Bearer <token>” in the header
    const [, token] = header.split(" ");
    if (!token) {
        return res.status(401).json({error: "Missing Bearer <token>"});
    }

    try {
        //Verify the token is correct using jwt and the secret
        const decoded = jwt.verify(token, JWT_SECRET);
        const rawUserId = decoded.userId;

        // Mongoose -->
        const mongoUser = await User.findById(rawUserId);
        const user = normalizeMongoId(mongoUser);

        // Prisma -->
        // const numericId = toPrismaId(rawUserId);
        // const user = await prisma.user.findUnique({
        //     where: { id: numericId },
        //     select: { id: true, role: true },
        // });

        if (!user) return res.status(401).json({ error: "User not found" });

        //Save the userId in the request and continue
        req.userId = user.id;
        req.userRole = user.role;
        next();

    } catch (err) {
        console.error("AUTH ERROR:", err);
        return res.status(401).json({ error: err.message });
    }
}

// Authorization middleware
export function requireRoles(requiredRoles) {
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    return function (req, res, next) {
        if (!req.userRole) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!roles.includes(req.userRole)) {
            return res.status(403).json({ error: "Forbidden" });
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