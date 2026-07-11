import cloudinary from "../lib/cloudinary.js";
import streamifier from "streamifier";
export const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "medflow/profile-images" }, (error, result) => {
            if (error)
                return reject(error);
            resolve(result);
        });
        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};
//# sourceMappingURL=cloudinaryUpload.js.map