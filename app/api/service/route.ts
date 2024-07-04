import Service from "@/lib/mongodb/models/Service";
import { connectToDB } from "@/lib/mongodb/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDB();
    const services = await Service.find();
    return NextResponse.json({ services });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { name, description, price } = await req.json();
    const createService = await Service.create({
      name,
      description,
      price,
    });
    return NextResponse.json({ createService });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
