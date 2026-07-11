import { verifyAccessToken } from "../utils/jwt.js";
export const authenticate = (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = header.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};
//# sourceMappingURL=authMiddleware.js.map