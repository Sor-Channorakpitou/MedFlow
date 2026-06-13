import type { Request, Response, NextFunction } from "express";
import { loginUser, refreshAccessToken, logoutUser } from "../services/authService";
import { refreshTokenCookieOptions } from "../utils/cookieOptions";

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