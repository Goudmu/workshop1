"use server";
import { NextResponse } from "next/server";
import { connectToDB } from "../utils/connect";
import GeneralLedger, { IGeneralLedger } from "../models/GeneralLedger";

export const GetGeneralLedgerData = async ({ startDate, endDate }: any) => {
  try {
    await connectToDB();
    const start = new Date(startDate);
    const end = new Date(endDate);

    let newGeneralLedger: IGeneralLedger[] = [];

    newGeneralLedger = await GeneralLedger.find({
      date: { $gte: start, $lte: end },
    }).lean();

    return newGeneralLedger;
  } catch (error) {
    console.log(error);
  }
};
