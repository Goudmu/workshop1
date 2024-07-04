import mongoose from "mongoose";

export const connectToDB = async () => {
  const connection: any = {};
  try {
    if (connection.isConnected) return;
    const db = await mongoose.connect(process.env.MONGODB_URI as string);
    connection.isConnected = db.connections[0].readyState;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
