"use server";
import { NextRequest, NextResponse } from "next/server";
import Account from "../models/Account";
import { connectToDB } from "../utils/connect";
import Item from "../models/Item";

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

export const addSameStock = async ({
  name,
  description,
  price,
  cost,
  stock,
  photo,
  _id,
}: any) => {
  try {
    await connectToDB();

    const newItem = await Item.findByIdAndUpdate(
      { _id },
      {
        name,
        description,
        price,
        cost,
        stock,
        photo,
      }
    );
    return NextResponse.json({ newItem });
  } catch (error) {
    console.log(error);
  }
};
