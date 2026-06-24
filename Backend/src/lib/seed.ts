import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";


const prisma = new PrismaClient();

export const seed = async () => {
    const PASSWORD = process.env.ADMIN_PASSWORD;
    const EMAIL = process.env.ADMIN_EMAIL;

    if (!PASSWORD || !EMAIL) {
        throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env");
    }

    // Find or create role 
    let adminRole = await prisma.role.findFirst({
        where: { name: "admin" }
    });

    if (!adminRole) {
        adminRole = await prisma.role.create({
            data: { name: "admin" }
        });
    }

    // Check if admin user exists
    const adminExist = await prisma.user.findUnique({
        where: { email: EMAIL }
    });

    if (!adminExist) {
        const passwordHash = await bcrypt.hash(PASSWORD, 10);

        await prisma.user.create({
            data: {
                email: EMAIL,
                name: "System admin",
                phone: "01234567",
                dateOfBirth: new Date("2000-11-20"),
                passwordHash,
                roleId: adminRole.id
            }
        });

        console.log("Admin user created");
    } else {
        console.log("Admin user already exists");
    }
};

seed();