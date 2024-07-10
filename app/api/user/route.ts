import User from "@/lib/mongodb/models/User";
import { connectToDB } from "@/lib/mongodb/utils/connect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const GET = async () => {
  try {
    await connectToDB();

    const user = await User.find();

    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { username, password, photo, role } = await req.json();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      password: hashedPassword,
      photo,
      role,
    });
    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
  }
};
