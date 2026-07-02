import type { Request, Response, NextFunction } from "express";
import { loginUser, refreshAccessToken, logoutUser, changePasswordUser } from "../services/authService.js";
import { refreshTokenCookieOptions } from "../utils/cookieOptions";
import { verifyAccessToken } from "../utils/jwt.js";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try { 
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "Missing fields"});
        }

        const { accessToken, refreshToken, user } = await loginUser(email.toLocaleLowerCase().trim(), password);

        // Store refresh token in httpOnly cookie
        res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

        return res.json({
            accessToken, 
            user: {
                id: user.id,
                email: user.email,
                role: user.role.name,
            },

        });

    } catch (error) {
        next(error);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken) {
            return res.status(401).json({ message: "No refresh token" });
        }

        const accessToken = await refreshAccessToken(refreshToken);
        return res.json({ accessToken });

    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken) {
            return res.status(400).json({ message: "No refresh token" });
        }

        await logoutUser(refreshToken);

        res.clearCookie("refreshToken", refreshTokenCookieOptions);

        return res.json({ message: "Logged out" });
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "NO_TOKEN" });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "INVALID_TOKEN" });
        }

        const payload = verifyAccessToken(token);

        const userId = payload.id;

        const { currentPassword, newPassword } = req.body;

        if (!userId || !currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        await changePasswordUser(userId, currentPassword, newPassword);

        return res.json({ message: "Password changed successfully" });
    } catch (error) {
        next(error);
    }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json({
            success: true,
            message: "User retrieved successfully.",
            user: {
                id: req.user?.id,
                role: req.user?.role
            }
        });
    } catch(error) {
        next(error);
    }
};