type CreateUserInput = {
    email: string;
    name: string;
    phone: string;
    password: string;
    dateOfBirth: string;
    roleId: number;
};
export declare const findAllUsers: () => Promise<{
    id: any;
    email: any;
    name: any;
    phone: any;
    roleId: any;
    dateOfBirth: string | null | undefined;
}[]>;
export declare const findUserById: (id: number) => Promise<{
    id: any;
    email: any;
    name: any;
    phone: any;
    roleId: any;
    dateOfBirth: string | null | undefined;
}>;
export declare const insertUser: (data: CreateUserInput) => Promise<{
    id: any;
    email: any;
    name: any;
    phone: any;
    roleId: any;
    dateOfBirth: string | null | undefined;
}>;
export declare const modifyUser: (id: number, data: {
    email?: string;
    name?: string;
    phone?: string;
    dateOfBirth?: string;
    roleId?: number;
}) => Promise<{
    id: any;
    email: any;
    name: any;
    phone: any;
    roleId: any;
    dateOfBirth: string | null | undefined;
}>;
export declare const removeUser: (id: number) => Promise<{
    id: any;
    email: any;
    name: any;
    phone: any;
    roleId: any;
    dateOfBirth: string | null | undefined;
}>;
export declare const deactivateUser: (id: number) => Promise<{
    id: any;
    email: any;
    name: any;
    phone: any;
    roleId: any;
    dateOfBirth: string | null | undefined;
}>;
export declare const findUserByRole: (roleId: number) => Promise<{
    id: any;
    email: any;
    name: any;
    phone: any;
    roleId: any;
    dateOfBirth: string | null | undefined;
}[]>;
export declare const findUserEmail: (email: string) => Promise<{
    id: number;
    email: string;
    name: string;
    phone: string | null;
    dateOfBirth: Date;
    passwordHash: string;
    role: {
        id: number;
        name: string;
    };
}>;
export declare const adminResetUserPassword: (userId: number, newPassword: string) => Promise<{
    message: string;
    newPassword: string;
}>;
export declare const uploadProfileImageService: (userId: number, file: Express.Multer.File) => Promise<{
    id: number;
    email: string;
    name: string;
    phone: string | null;
    dateOfBirth: Date;
    passwordHash: string;
    isActive: boolean;
    createdAt: Date;
    roleId: number;
    profileImage: string | null;
    profilePublicId: string | null;
}>;
export {};
//# sourceMappingURL=userService.d.ts.map