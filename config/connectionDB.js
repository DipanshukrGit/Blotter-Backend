import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL environment variable is not set");
        }
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.error("❌ Error connecting to database:", error.message);
        process.exit(1);
    }
}
