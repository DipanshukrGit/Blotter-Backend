import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB CONNECTED");
    } catch (error) {
        console.log("Error to connect DB:", error.message);
    }
}
