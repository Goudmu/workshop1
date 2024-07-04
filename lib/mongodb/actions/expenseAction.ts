"use server";
import { NextResponse } from "next/server";
import Account from "../models/Account";
import { connectToDB } from "../utils/connect";

export const AccountForExpenses = async () => {
  try {
    await connectToDB();
    const cashAccount = await Account.findOne({ accountID: "1000" });
    return NextResponse.json({ cashAccount });
  } catch (error) {
    console.log(error);
  }
};
