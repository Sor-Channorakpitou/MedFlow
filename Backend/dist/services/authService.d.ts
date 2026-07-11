export declare const loginUser: (email: string, password: string) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
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
    };
}>;
export declare const refreshAccessToken: (refreshToken: string) => Promise<string>;
export declare const logoutUser: (refreshToken: string) => Promise<boolean>;
export declare const changePasswordUser: (userId: number, curPassword: string, newPassword: string) => Promise<void>;
//# sourceMappingURL=authService.d.ts.map