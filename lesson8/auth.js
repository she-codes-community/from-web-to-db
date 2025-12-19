import jwt from "jsonwebtoken";

export function auth(req, res, next) {
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

        //Save the userId in the request and continue
        req.userId = decoded.userId;
        next();

        //If the token is not valid, return 401 error
        } catch (err) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
}