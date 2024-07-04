import GeneralLedger from "@/lib/mongodb/models/GeneralLedger";
import Item from "@/lib/mongodb/models/Item";
import { connectToDB } from "@/lib/mongodb/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDB();
    const item = await Item.find();
    return NextResponse.json({ item });
  } catch (error) {
    console.log(error);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    const {
      name,
      description,
      price,
      cost,
      stock,
      photo,
      dateGL,
      descGL,
      debitsGL,
      creditsGL,
      typeGL,
    } = await req.json();

    if (!name || !description || !price || !cost || !stock) {
      return NextResponse.json({ message: "Fill All the Required" });
    }

    if (!dateGL || !descGL || !debitsGL || !creditsGL) {
      return NextResponse.json({
        message: "Fill All The Required for General Ledger",
      });
    }

    const newGeneralLedger = await GeneralLedger.create({
      date: dateGL,
      description: descGL,
      debits: debitsGL.map(
        (debit: {
          accountID: string;
          amount: number;
          account_id: string;
          accountName: string;
        }) => ({
          account_id: debit.account_id,
          accountName: debit.accountName,
          accountID: debit.accountID,
          amount: debit.amount,
        })
      ),
      credits: creditsGL.map(
        (credit: {
          accountID: string;
          amount: number;
          account_id: string;
          accountName: string;
        }) => ({
          account_id: credit.account_id,
          accountName: credit.accountName,
          accountID: credit.accountID,
          amount: credit.amount,
        })
      ),
      type: typeGL,
    });

    const newItem = await Item.create({
      name,
      description,
      price,
      cost,
      stock,
      photo,
    });
    return NextResponse.json({ newItem });
  } catch (error) {
    console.log(error);
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { name, description, price, cost, stock, photo, _id } =
      await req.json();
    const updatedItem = await Item.findByIdAndUpdate(
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
    return NextResponse.json({ updatedItem });
  } catch (error) {
    console.log(error);
  }
};
