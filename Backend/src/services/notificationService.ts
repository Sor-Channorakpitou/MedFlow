// import prisma from "../lib/prisma.js";

// export const createNotification = async (data: {
//     title: string;
//     message?: string;
//     type: "APPOINTMENT" | "INVOICE" | "QUEUE" | "PRESCRIPTION" | "SYSTEM";
//     userId?: number;
//     roleId?: number;
// }) => {
//     if (!data.title || !data.type) {
//         throw new Error("MISSING_REQUIRED_FIELDS");
//     }

//     if (!data.userId && !data.roleId) {
//         throw new Error("NOTIFICATION_TARGET_REQUIRED");
//     }

//     return prisma.notification.create({
//         data: {
//             title: data.title.trim(),
//             message: data.message?.trim(),
//             type: data.type,
//             userId: data.userId,
//             roleId: data.roleId
//         }
//     });
// };

// export const getNotifications = async (filter: {
//     userId?: number;
//     roleId?: number;
// }) => {
//     if (!filter.userId && !filter.roleId) {
//         throw new Error("MISSING_REQUIRED_FIELDS");
//     }

//     return prisma.notification.findMany({
//         where: {
//             OR: [
//                 filter.userId ? { userId: filter.userId } : undefined,
//                 filter.roleId ? { roleId: filter.roleId } : undefined
//             ].filter(Boolean) as any
//         },
//         orderBy: {
//             createdAt: "desc"
//         }
//     });
// };

// export const markNotificationAsRead = async (id: number) => {
//     if (!id) {
//         throw new Error("MISSING_REQUIRED_FIELDS");
//     }

//     const notification = await prisma.notification.findUnique({
//         where: { id }
//     });

//     if (!notification) {
//         throw new Error("NOT_FOUND");
//     }

//     return prisma.notification.update({
//         where: { id },
//         data: { read: true }
//     });
// };

// export const markAllNotificationsAsRead = async (filter: {
//     userId?: number;
//     roleId?: number;
// }) => {
//     if (!filter.userId && !filter.roleId) {
//         throw new Error("MISSING_REQUIRED_FIELDS");
//     }

//     return prisma.notification.updateMany({
//         where: {
//             OR: [
//                 filter.userId ? { userId: filter.userId } : undefined,
//                 filter.roleId ? { roleId: filter.roleId } : undefined
//             ].filter(Boolean) as any
//         },
//         data: {
//             read: true
//         }
//     });
// };