import Account from "@/lib/mongodb/models/Account";
import { connectToDB } from "@/lib/mongodb/utils/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDB();
    const expenses = await Account.find().where({ accountID: /^5\d*$/ });

    return NextResponse.json({ expenses });
  } catch (error) {
    console.log(error);
  }
};
