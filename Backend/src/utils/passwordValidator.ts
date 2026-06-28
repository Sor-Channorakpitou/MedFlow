export const validatePassword = ( password: string ) => {
    if (password.length < 8)
        throw new Error("PASSWORD_TOO_SHORT");

    if (!/[A-Z]/.test(password))
        throw new Error("PASSWORD_MISSING_UPPERCASE");

    if (!/[a-z]/.test(password))
        throw new Error("PASSWORD_MISSING_LOWERCASE");

    if (!/\d/.test(password))
        throw new Error("PASSWORD_MISSING_NUMBER");
};