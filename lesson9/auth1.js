import jwt from "jsonwebtoken";
import User from "./mongomodels/user.js";

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
};

