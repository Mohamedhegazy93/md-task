import multer from "multer";
import path from "path";
import User from "../models/user.model.js";
import fs from "fs";

// dynamic folder path
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const userId = req.user?.userId?.toString();
    if (!userId) return cb(new Error("User ID not found in request"));
    const user = await User.findById(userId);
    if (!user) return cb(new Error("User not found"));

    const username = user.displayName?.replace(/\s+/g, "_") || user.phone;

    const uploadPath = path.join("uploads", username);

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = function (req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isValid = allowedTypes.test(file.mimetype);
  cb(null, isValid);
};

export const upload = multer({ storage, fileFilter });
