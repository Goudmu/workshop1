"use server";

import Account, { IAccount } from "../models/Account";
import GeneralLedger, { IGeneralLedger } from "../models/GeneralLedger";
import { connectToDB } from "../utils/connect";

export const getIncomeAccount = async () => {
  try {
    await connectToDB();
    const incomeAccount = await Account.find({
      accountID: { $regex: "^[45]" },
    }).lean();
    const plainIncomeAccount = incomeAccount.map((entry: any) => ({
      ...entry,
      _id: entry._id.toString(),
    }));
    return { plainIncomeAccount };
  } catch (error) {
    console.log(error);
  }
};

export const getLabaRugiData = async () => {
  try {
    await connectToDB();
    let incomeAccount = await Account.find({
      accountID: { $regex: "^[45]" },
    });

    const generalLedgerData = await GeneralLedger.find({
      // date: { $gte: start, $lte: end },
      type: "jurnalumum",
      $or: [
        { "debits.accountID": { $regex: "^[45]" } },
        { "credits.accountID": { $regex: "^[45]" } },
      ],
    });

    let incomeAccountFix = incomeAccount.map((dataAcc) => {
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

      // Process debits and credits
      generalLedgerData.forEach((dataGL) => {
        dataGL.debits.forEach((dataDebit: any) => {
          if (dataDebit.account_id === dataAccIdString) {
            if (modifiedDataAcc.balance === "debit") {
              modifiedDataAcc.amount += dataDebit.amount;
            } else {
            }
          }
        });

        dataGL.credits.forEach((dataCredit: any) => {
          if (dataCredit.account_id === dataAccIdString) {
            if (modifiedDataAcc.balance === "debit") {
              modifiedDataAcc.amount -= dataCredit.amount;
            } else {
              modifiedDataAcc.amount += dataCredit.amount;
            }
          }
        });
      });

      return modifiedDataAcc;
    });

    return { incomeAccountFix };
  } catch (error) {
    console.log(error);
  }
};
