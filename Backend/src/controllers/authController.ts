import type { Request, Response } from "express";
import { loginUser, refreshAccessToken, logoutUser } from "../services/authService";
import { refreshTokenCookieOptions } from "../utils/cookieOptions";

export const login = async (req: Request, res: Response) => {
    try { const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: "Missing fields"});
    }

    const { accessToken, refreshToken, user } = await loginUser(email, password);

    // Store refresh token in httpOnly cookie
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    return res.json({
        accessToken, 
        user: {
            id: user.id,
            email: user.email,
            roleid: user.roleId,
        },

    });

    } catch (error: any) {
        if(error.message === "INVALID_CREDENTIALS") {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken) {
            return res.status(401).json({ message: "No refresh token" });
        }

        const accessToken = await refreshAccessToken(refreshToken);
        return res.json({ accessToken });

    } catch (error: any) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken) {
            return res.status(400).json({ message: "No refresh token" });
        }

        await logoutUser(refreshToken);

        res.clearCookie("refreshToken", refreshTokenCookieOptions);

        return res.json({ message: "Logged out" });
    } catch {
        return res.status(500).json({ message: "Internal server error" });
    }
};