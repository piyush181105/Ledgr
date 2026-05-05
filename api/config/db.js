import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // .trim() removes any accidental spaces or hidden line breaks
    const uri = process.env.MONGO_URI.trim(); 
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log("MongoDB Connected!");
  } catch (err) {
    console.error("Connection error:", err.message);
    process.exit(1);
  }
};
