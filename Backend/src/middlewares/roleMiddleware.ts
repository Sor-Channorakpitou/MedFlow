import type { Request, Response, NextFunction } from "express";

export const authorize = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { id: number; role: string } | undefined;
    
    if(!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if(!roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden" });
    }

    next();
}