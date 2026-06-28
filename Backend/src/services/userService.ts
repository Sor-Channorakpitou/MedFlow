import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { toUserDTO } from "../utils/dataFormat.js";
import { validatePassword } from "../utils/passwordValidator.js";

type CreateUserInput = {
    email: string;
    name: string;
    phone: string;
    password: string;
    dateOfBirth: string;
    roleId: number;
};

export const findAllUsers = async () => {
    const users = await prisma.user.findMany({
        where: { isActive: true }
    });

    if(!users) throw new Error("NO_RESOURCES"); 

    return users.map(toUserDTO);
};

export const findUserById = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: { id }
    });

    if(!user) {
        throw new Error("NOT_FOUND");
    }

    return toUserDTO(user);
};

export const insertUser = async ( data: CreateUserInput ) => {
    if (        
        !data.email ||
        !data.password ||
        !data.name ||
        !data.roleId ||
        !data.dateOfBirth
    ) {
        throw new Error("MISSING_REQUIRED_FIELDS");
    }

    const existing = await prisma.user.findUnique({
        where: { email: data.email }
    });

    if (existing) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    validatePassword(data.password);

    const  passwordHash = await bcrypt.hash(data.password, 10);
    return toUserDTO(await prisma.user.create({ 
        data: {
            email: data.email.toLocaleLowerCase().trim(),
            name: data.name.trim(),
            phone: data.phone?.trim(),
            passwordHash: passwordHash,
            dateOfBirth: data.dateOfBirth,
            roleId: data.roleId
        },
        select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            dateOfBirth: true,
            roleId: true,
        }

        })
    ) 
};

export const modifyUser = async (
    id: number,
    data: {
            email?: string,
            name?: string, 
            phone?: string,
            dateOfBirth?: string,
            roleId?: number
    } 
    ) => {

    const user = await prisma.user.findUnique({
        where: { id }
    });

    if(!user) {
        throw new Error("NOT_FOUND");
    }

    const updateData: any = {};
    
    if (data.email !== undefined) {

        const existing = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existing && existing.id !== id) {
            throw new Error("EMAIL_ALREADY_EXISTS");
        }

        updateData.email = data.email.trim().toLowerCase();
            
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.dateOfBirth !== undefined) updateData.dateOfBirth = data.dateOfBirth;
    if (data.roleId !== undefined) updateData.roleId = data.roleId;

    return toUserDTO(
        await prisma.user.update({
            where: { id },
            data: updateData
        })
    );
};

export const removeUser = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: { id }
    });

    if(!user) {
        throw new Error("NOT_FOUND");
    }

    return toUserDTO(await prisma.user.delete({
        where: { id }
    }));
};

export const deactivateUser = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: { id }
    });

    if(!user) throw new Error("NOT_FOUND");
    if(!user.isActive) throw new Error("USER_ALREADY_INACTIVE");

    return toUserDTO(
        await prisma.user.update({
            where: { id },
            data: { isActive: false },
            select: {
                id: true, 
                email: true, 
                name: true,
                phone: true, 
                dateOfBirth: true, 
                roleId: true
            }
        })
    );
};

export const findUserByRole = async (roleId : number) => {
    const users = await prisma.user.findMany({
        where: { roleId },
        select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            dateOfBirth: true, 
            roleId: true
        }
    });
    return users.map(toUserDTO);
};

export const findUserEmail = async (email: string) => {
    const emailLowercase = email.toLocaleLowerCase().trim();
    const user = await prisma.user.findUnique({
        where: { email: emailLowercase },
        select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            dateOfBirth: true,
            role: {
                select: {
                    id: true,
                    name: true
                }
            },
            passwordHash: true
        }
    });

    if(!user) throw new Error("NOT_FOUND");
    return user;
}

export const adminResetUserPassword = async (userId: number, newPassword: string) => { 
    if(!userId) throw new Error("MISSING_REQUIRED_FIELDS");

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if(!user) throw new Error("NOT_FOUND");

    validatePassword(newPassword);

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: userId },
        data: { passwordHash,
            mustChangePassword: true
        }
    });

    return {
        message: "PASSWORD_RESET_SUCCESS",
        newPassword
    }

}