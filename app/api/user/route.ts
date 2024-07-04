import User from "@/lib/mongodb/models/User";
import { connectToDB } from "@/lib/mongodb/utils/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDB();
    const user = await User.find();
    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
  }
};
