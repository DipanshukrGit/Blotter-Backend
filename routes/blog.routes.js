import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { upload } from "../middlewares/multer.js";
import {
  allBlogs,
  createBlog,
  deleteBlog,
  userBlogs,
  singleBlog,
} from "../controllers/blog.controller.js";
const router = express.Router();

// Public routes - specific routes first
router.get("/all", allBlogs);

// Protected routes - specific routes first
router.post("/create", isAuthenticated, upload.single("image"), createBlog);
router.get("/user/blogs", isAuthenticated, userBlogs);
router.delete("/delete/:id", isAuthenticated, deleteBlog);

// Dynamic routes last
router.get("/:id", singleBlog);

export default router;