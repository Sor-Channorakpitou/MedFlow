export const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "Production",
    sameSite: "lax" as const,
    path: "/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};