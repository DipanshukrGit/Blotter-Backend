import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const image_filename = req.file ? req.file.filename : undefined;
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      image: image_filename,
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res
      .status(201)
      .json({ message: "User created successfully", success: true, user: userResponse });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || process.env.JWT_SCERECT, {
      expiresIn: "1d",
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res
      .status(200)
      .json({ message: "Login successful", success: true, token, user: userResponse });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};