"use server";
import { NextResponse } from "next/server";
import { connectToDB } from "../utils/connect";
import GeneralLedger, { IGeneralLedger } from "../models/GeneralLedger";

export const GetGeneralLedgerData = async ({
  startDate,
  endDate,
  type,
}: any) => {
  try {
    await connectToDB();
    const start = new Date(startDate);
    const end = new Date(endDate);

    let newGeneralLedger: IGeneralLedger[] = [];

    newGeneralLedger = await GeneralLedger.find({
      date: { $gte: start, $lte: end },
      type,
    }).lean();

    // const generalLedger = await GeneralLedger.find({ type: "jurnalumum" });

    newGeneralLedger = newGeneralLedger.map((entry: IGeneralLedger) => {
      entry._id = entry._id?.toString();
      entry.debits.map((dataDebit: any) => {
        dataDebit._id = dataDebit._id.toString();
        dataDebit.account_id = dataDebit.account_id.toString();
        return dataDebit;
      });
      entry.credits.map((dataCredit: any) => {
        dataCredit._id = dataCredit._id.toString();
        dataCredit.account_id = dataCredit.account_id.toString();
        return dataCredit;
      });
      return entry;
    });

    return newGeneralLedger;
  } catch (error) {
    console.log(error);
  }
};
