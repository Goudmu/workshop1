"use server";
import { NextRequest, NextResponse } from "next/server";
import Account from "../models/Account";
import { connectToDB } from "../utils/connect";

export const GeneralLedgerForBuyingItems = async () => {
  try {
    await connectToDB();
    const cashAccount = await Account.findOne({ accountID: "1000" });
    const inventoryAccounts = await Account.findOne({ accountID: "1200" });
    return NextResponse.json({ cashAccount, inventoryAccounts });
  } catch (error) {
    console.log(error);
  }
};
