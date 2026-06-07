import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import type { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";

export const login = async (req:Request, res: Response) => {
    try {
            const { email, password } = req.body;

            if(!email || !password) {
                return res.status(400).json({ message: "Missing fields" });
            }

            const user = await prisma.User.findUnique({
                where: { email: email }
            });

            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const accessToken = generateAccessToken({
                id: user.id,
                role: user.role,
            });

            const refreshToken = generateRefreshToken({
                id: user.id
            });

            await prisma.RefreshToken.create({
                data: {
                    token: refreshToken,
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });

         return res.json({ accessToken, refreshToken, user: {
            id: user.id,
            email: user.email,
            role: user.role
            } 
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "No token" });
    }

    const storedToken = await prisma.RefreshToken.findUnique({
        where: { token: refreshToken }
    });

    if (!storedToken) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }

    try {
        const payload = verifyRefreshToken(refreshToken) as { id: number };

        const user = await prisma.User.findUnique({
            where: { id: payload.id }
        });

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newAccessToken = generateAccessToken({
            id: user.id,
            role: user.role,
        });

        return res.json({ accessToken: newAccessToken });

    } catch (err) {
        return res.status(403).json({ message: "Expired or invalid token" });
    }
};

export const logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if(!refreshToken) {
        return res.status(401).json({ message: "No token" });
    }

    await prisma.RefreshToken.deleteMany({
        where: { token: refreshToken }
    });

    return res.json({ message: "Logged out" });
};