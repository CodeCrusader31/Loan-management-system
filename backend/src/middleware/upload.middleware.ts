import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

// File filter (same logic you had ✅)
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPEG, JPG, and PNG files are allowed"));
  }
};

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const originalName = file.originalname.split('.').slice(0, -1).join('.'); // remove extension

    return {
      folder: "salary_slips",
      resource_type: "auto",

      // ✅ NO extension here
      public_id: Date.now() + "-" + originalName,
    };
  },
});

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});