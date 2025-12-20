import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/user.js";

const JWT_SECRET = "library-secret";

export async function hashPassword(password) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

export async function comparePassword(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}

export function createToken(user) {
    // שומרים רק מה שצריך
    return jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
    );
}

export async function auth(req, res, next) {
    // Getting the authorization header from the request
    const header = req.headers.authorization;

    // If there is no header → there is no token → return 401 error
    if (!header) {
        return res.status(401).json({error: "Missing Authorization header"});
    }

    // Looking for "Bearer <token>” in the header.
    // Return 401 if header exists but token is missing
    const [, token] = header.split(" ");
    if (!token) {
        return res.status(401).json({error: "Missing token"});
    }
    try {
        //Verify the token is correct using jwt and the secret
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) return res.status(401).json({ error: "User not found" });

        //Save the userId in the request and continue
        req.userId = decoded.userId;
        req.userRole = user.role;
        next();

        //If the token is not valid, return 401 error
    } catch (err) {
        return res.status(401).json({error: "Invalid or expired token"});
    }

}
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
