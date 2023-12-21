import multer from "multer";
import path from "path";
import { HttpError } from "../helpers/HttpError.js";

const ALLOWED_EXT = ["svg", "gif", "png", "jpg", "jpeg", "webp"];
const destination = path.resolve("temp");

const storage = multer.diskStorage({
   destination,
   filename: (req, file, cb) => {
      const prefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${prefix}_${file.originalname}`);
   },
});

const limits = { fileSize: 524288 }; // 512K

const fileFilter = (req, file, cb) => {
   const ext = file.originalname.split(".").pop();
   const isAllowedExt = ALLOWED_EXT.some((el) => el === ext);
   if (!isAllowedExt) {
      return cb(new HttpError(400, "File is not an image"));
   }
   cb(null, true);
};

const uploader = multer({ storage, limits, fileFilter });

export default uploader;
