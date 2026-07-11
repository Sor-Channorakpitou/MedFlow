export type AccessPayload = {
    id: number;
    role: string;
};
export type RefreshPayload = {
    id: number;
};
export declare const generateAccessToken: (user: AccessPayload) => string;
export declare const generateRefreshToken: (user: RefreshPayload) => string;
export declare const verifyAccessToken: (token: string) => AccessPayload;
export declare const verifyRefreshToken: (token: string) => RefreshPayload;
//# sourceMappingURL=jwt.d.ts.map