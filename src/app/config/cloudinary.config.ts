/* eslint-disable no-console */
import multer from "multer";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError"
import httpStatus from "http-status-codes"
import { Readable } from "stream";
import { getPublicIdFromUrl } from "../utils/getPublicIdFromUrl";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_CLOUD_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_CLOUD_API_SECRET
});

const storage = multer.memoryStorage();

// Multer upload configuration with validation
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Only image files (JPEG, PNG, GIF, WebP) are allowed!"))
    }
  }
});

// Upload to Cloudinary
const uploadToCloudinary = async (file: Express.Multer.File): Promise<UploadApiResponse> => {
  if (!file?.buffer) throw new AppError(httpStatus.BAD_REQUEST, "No file path found for upload");

  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "special-surprise",
          resource_type: "auto"
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as UploadApiResponse)
        }
      );

      const bufferStream = Readable.from(file.buffer);
      bufferStream.pipe(uploadStream);
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new AppError(httpStatus.BAD_REQUEST, `Failed to upload file to Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Delete from Cloudinary
const deleteFromCloudinary = async (url: string) => {
  try {
    const publicId = getPublicIdFromUrl(url);
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete file");
  }
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary
}

