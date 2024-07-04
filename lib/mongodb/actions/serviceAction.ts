"use server";
import { NextResponse } from "next/server";
import Account from "../models/Account";
import { connectToDB } from "../utils/connect";

export const AccountForService = async () => {
  try {
    await connectToDB();
    const cashAccount = await Account.findOne({ accountID: "1000" });
    const revenueAccount = await Account.findOne({ accountID: "4100" });
    return NextResponse.json({ cashAccount, revenueAccount });
  } catch (error) {
    console.log(error);
  }
};
