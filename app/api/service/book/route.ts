import GeneralLedger from "@/lib/mongodb/models/GeneralLedger";
import { connectToDB } from "@/lib/mongodb/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { date, description, debits, credits, type } = await req.json();
    // VALIDATE INPUT
    if (!date || !description || !debits || !credits || !type) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // CREATE NEW
    const newEntry = await GeneralLedger.create({
      date: new Date(date),
      description,
      debits: debits.map(
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
      credits: credits.map(
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
      type,
    });

    return NextResponse.json({ message: "General Ledger Has Created" });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
