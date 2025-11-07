import express from "express";
import { login, signup } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";
const router = express.Router();

router.post("/signup", upload.single("image"), signup);
router.post("/login", login);
export default router;