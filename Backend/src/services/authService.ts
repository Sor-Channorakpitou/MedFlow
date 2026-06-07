import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

export const loginUser = async (email: string, password: string) => {
    // Find user in DB
    const user = await prisma.user.findUnique({
        where: { email }
    }); 

    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if(!isMatch) {
        throw new Error("INVALID_CREDENTIALS");
    }

    // Provide access token & refresh token
    const accessToken = generateAccessToken({
        id: user.id,
        roleid: user.roleId,
    });

    const refreshToken = generateRefreshToken({
        id: user.id
    });

    // Store refresh token in DB
    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });

    return { accessToken, refreshToken, user };
};

export const refreshAccessToken = async (refreshToken: string) => {
    if (!refreshToken) {
        throw new Error("NO_REFRESH_TOKEN");
    }

    // Check DB session exists
    const storedSession = await prisma.refreshToken.findUnique({
        where: { token: refreshToken }
    });

    if (!storedSession) {
        throw new Error("INVALID_REFRESH_TOKEN");
    }

    // Verify JWT 
    let payload: { id: number };

    try {
        payload = verifyRefreshToken(refreshToken) as { id: number };
    } catch (error) {
        throw new Error("INVALID_REFRESH_TOKEN");
    }

    // Check user still exists
    const user = await prisma.user.findUnique({
        where: { id: payload.id }
    });

    if(!user) {
        throw new Error("USER_NOT_FOUND");        
    }

    // Issued new access token 
    const newAccessToken = generateAccessToken({
        id: user.id,
        roleid: user.roleId,
    });

    return newAccessToken;
};

export const logoutUser = async (refreshToken: string) => {
    if (!refreshToken) {
        throw new Error("NO_REFRESH_TOKEN");
    }

    await prisma.refreshToken.deleteMany({
        where: { token: refreshToken }
    });

    return true;
};