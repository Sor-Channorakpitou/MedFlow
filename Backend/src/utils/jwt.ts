import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
    throw new Error("Missing JWT secrets in environment variables");
}

type AccessPayload = {
    id: number;
    roleid: number;
};

type RefreshPayload = {
    id: number;
};

export const generateAccessToken = (user: AccessPayload) => {
    return jwt.sign(user, ACCESS_SECRET!, { expiresIn: "15m" });
}

export const generateRefreshToken = (user: RefreshPayload) => {
    return jwt.sign(user, REFRESH_SECRET!, { expiresIn: "7d" });
}

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ACCESS_SECRET) as AccessPayload;
}

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_SECRET) as RefreshPayload;
}