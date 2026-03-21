import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected ✅");
  } catch (error) {
    console.log("MongoDB error ❌:", error.message);
  }
};

export default connectDb;
