import Blog from "../models/blog.model.js";
import fs from "fs";

export const allBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ blogs, success: true, message: "All blogs" });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, category, description } = req.body;
    
    // Validation
    if (!title || !category || !description) {
      return res
        .status(400)
        .json({ message: "Title, category, and description are required", success: false });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Image is required", success: false });
    }

    const image_filename = req.file.filename;
    const blog = await Blog.create({
      title,
      category,
      description,
      image: image_filename,
      author: {
        id: req.user._id,
        name: req.user.name,
        image: req.user.image || "",
      },
    });
    return res
      .status(201)
      .json({ message: "Blog created successfully", success: true, blog });
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found", success: false });
    }
    if (blog.author.id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this blog", success: false });
    }
    // Delete image file if it exists
    if (blog.image) {
      fs.unlink(`uploads/${blog.image}`, (err) => {
        if (err) console.error("Error deleting image file:", err);
      });
    }
    await blog.deleteOne();
    return res
      .status(200)
      .json({ message: "Blog deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const singleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res
        .status(404)
        .json({ message: "Blog not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Blog found", success: true, blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const userBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ "author.id": req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ blogs, success: true, message: "User blogs retrieved" });
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};