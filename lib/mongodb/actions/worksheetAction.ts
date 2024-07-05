"use server";
import { connectToDB } from "../utils/connect";
import GeneralLedger, { IGeneralLedger } from "../models/GeneralLedger";
import Account, { IAccount } from "../models/Account";

export const GetWorksheetData = async ({ startDate, endDate }: any) => {
  try {
    await connectToDB();
    const start = new Date(startDate);
    const end = new Date(endDate);

    let generalLedger: IGeneralLedger[] = [];
    let adjustLedger: IGeneralLedger[] = [];
    let closingLedger: IGeneralLedger[] = [];

    generalLedger = await GeneralLedger.find({
      date: { $gte: start, $lte: end },
      type: "jurnalumum",
    }).lean();
    adjustLedger = await GeneralLedger.find({
      date: { $gte: start, $lte: end },
      type: "jurnalpenyesuaian",
    }).lean();
    closingLedger = await GeneralLedger.find({
      date: { $gte: start, $lte: end },
      type: "jurnalumum",
      $or: [
        { "debits.accountID": { $regex: "^[45]" } },
        { "credits.accountID": { $regex: "^[45]" } },
      ],
    }).lean();
    const accounts = await Account.find().lean();

    const plainGL = generalLedger.map((entry: any) => ({
      ...entry,
      _id: entry._id.toString(),
    }));
    const plainAL = adjustLedger.map((entry: any) => ({
      ...entry,
      _id: entry._id.toString(),
    }));
    const plainCL = closingLedger.map((entry: any) => ({
      ...entry,
      _id: entry._id.toString(),
    }));
    const plainAcc = accounts.map((entry: any) => ({
      ...entry,
      _id: entry._id.toString(),
    }));

    return {
      generalLedger: plainGL,
      adjustLedger: plainAL,
      accounts: plainAcc,
      closingLedger: plainCL,
    };
  } catch (error) {
    console.log(error);
  }
};
