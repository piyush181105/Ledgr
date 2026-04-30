import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://piyushjaiswal1805_db_user:6NTePTIbztC8Oi7a@cluster0.gozj1n6.mongodb.net/Ledgr ")
        .then(() => console.log("Connected to MongoDB"));
}