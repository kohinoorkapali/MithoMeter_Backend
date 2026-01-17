import multer from "multer";
import path from "path";
import fs from "fs";

const BASE_UPLOAD_DIR = path.resolve("./uploads");

function createMulterUploader(folderName) {
  const uploadPath = path.join(BASE_UPLOAD_DIR, folderName);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + path.extname(file.originalname));
    },
  });

  return multer({ storage });
}

export const reviewPhotoUploader = createMulterUploader("reviewPhotos");
export const restaurantUploader = createMulterUploader("restaurants");
export const profileUploader = createMulterUploader("profile");
