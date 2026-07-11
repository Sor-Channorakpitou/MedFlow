import type { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { findAllRoles, findAvailableDoctorsName, uploadProfileImageService } from "../services/userService.js";
import { adminResetUserPassword, deactivateUser, findAllUsers, findUserById, insertUser, modifyUser, removeUser, activateUser, findAvailableNursesName } from "../services/userService.js";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await findAllUsers();

        if(users.length === 0) return res.status(404).json({ message: "No users found" });
    
        return res.json(users);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id  = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await findUserById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json(user);

    } catch (error) {
        next(error);
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminRole = await prisma.role.findFirst({ where: { name: "ADMIN" } });

        if (Number(req.body.roleId) === adminRole?.id && !(req.user as any)?.isSuperAdmin) {
            return res.status(403).json({ message: "Only superadmin can create admin accounts" });
        }
        
        const { email, name, phone, dateOfBirth, password, roleId } = req.body;

        const data = {
            email,
            name,
            phone, 
            dateOfBirth,
            password,
            roleId
        };

        const user = await insertUser(data);

        return res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name, phone, dateOfBirth, password, roleId } = req.body;
        const id = Number(req.params.id);

        const data = {
            email,
            name,
            phone, 
            dateOfBirth,
            password,
            roleId
        };

        const user = await modifyUser(id,data);

        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);

        const deleted = await removeUser(id);

        if (!deleted) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

export const deactivateUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);

        const user = await deactivateUser(id);

        if(!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ message: "User deactivate successfully", user });  
    } catch (error) {
        next(error);
    }
};

export const activateUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);

        const user = await activateUser(id);

        if(!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ message: "User activate successfully", user });  
    } catch (error) {
        next(error);
    }
};

export const adminResetPasswordUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const { newPassword } = req.body;


        const user = await adminResetUserPassword(id, newPassword);

        if(!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ message: "Password reset successfully" });  
    }catch (error) {
        next(error);
    }
};

export const uploadProfileImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const file = req.file;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const result = await uploadProfileImageService(userId, file);

        return res.status(200).json({
            message: "PROFILE_IMAGE_UPDATED",
            data: result
        });

    } catch (error) {
        next(error);
    }
};

export const getAllNursesName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await findAvailableNursesName();

        if(users.length === 0) return res.status(404).json({ message: "No users found" });
    
        return res.json(users);
    } catch (error) {
        next(error);
    }
};

export const getAllDoctorsName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await findAvailableDoctorsName();
    return res.json(users);
  } catch (error) {
    next(error);
  }
}

export const getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await findAllRoles();
    return res.json(roles);
  } catch (error) {
    next(error);
  }
};






