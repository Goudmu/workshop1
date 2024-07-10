import User from "@/lib/mongodb/models/User";
import { connectToDB } from "@/lib/mongodb/utils/connect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { username, password } = await req.json();
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: "user not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return NextResponse.json({ user });
    } else {
      return NextResponse.json({ message: "wrong password" });
    }
  } catch (error) {
    console.log(error);
  }
};
