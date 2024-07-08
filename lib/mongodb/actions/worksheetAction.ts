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

    const plainGL = generalLedger.map((entry: IGeneralLedger) => {
      const newDebits = entry.debits.map((dataDebit: any) => {
        return {
          ...dataDebit,
          _id: entry._id ? dataDebit._id.toString() : undefined,
        };
      });

      const newCredits = entry.credits.map((dataDebit: any) => {
        return {
          ...dataDebit,
          _id: entry._id ? dataDebit._id.toString() : undefined,
        };
      });

      return {
        ...entry,
        _id: entry._id ? entry._id.toString() : undefined,
        debits: newDebits,
        credits: newCredits,
      };
    });
    const plainAL = adjustLedger.map((entry: IGeneralLedger) => {
      const newDebits = entry.debits.map((dataDebit: any) => {
        return {
          ...dataDebit,
          _id: entry._id ? dataDebit._id.toString() : undefined,
        };
      });

      const newCredits = entry.credits.map((dataDebit: any) => {
        return {
          ...dataDebit,
          _id: entry._id ? dataDebit._id.toString() : undefined,
        };
      });

      return {
        ...entry,
        _id: entry._id ? entry._id.toString() : undefined,
        debits: newDebits,
        credits: newCredits,
      };
    });
    const plainCL = closingLedger.map((entry: IGeneralLedger) => {
      const newDebits = entry.debits.map((dataDebit: any) => {
        return {
          ...dataDebit,
          _id: entry._id ? dataDebit._id.toString() : undefined,
        };
      });

      const newCredits = entry.credits.map((dataDebit: any) => {
        return {
          ...dataDebit,
          _id: entry._id ? dataDebit._id.toString() : undefined,
        };
      });

      return {
        ...entry,
        _id: entry._id ? entry._id.toString() : undefined,
        debits: newDebits,
        credits: newCredits,
      };
    });
    const plainAcc = accounts.map((dataAcc: any) => {
      // Convert ObjectId to string
      const dataAccIdString = dataAcc._id.toString();

      // Initialize a plain object to store the modified account
      let modifiedDataAcc = {
        _id: dataAccIdString,
        accountID: dataAcc.accountID,
        name: dataAcc.name,
        balance: dataAcc.balance,
        amount: dataAcc.amount,
        __v: dataAcc.__v,
      };
      return modifiedDataAcc;
    });

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
