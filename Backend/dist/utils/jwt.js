import jwt from "jsonwebtoken";
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
if (!ACCESS_SECRET || !REFRESH_SECRET) {
    throw new Error("Missing JWT secrets in environment variables");
}
export const generateAccessToken = (user) => {
    return jwt.sign(user, ACCESS_SECRET, { expiresIn: "15m" });
};
export const generateRefreshToken = (user) => {
    return jwt.sign(user, REFRESH_SECRET, { expiresIn: "7d" });
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_SECRET);
};
//# sourceMappingURL=jwt.js.map