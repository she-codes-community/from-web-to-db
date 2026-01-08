
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
