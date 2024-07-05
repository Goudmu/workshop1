"use server";
import { NextResponse } from "next/server";
import Account from "../models/Account";
import { connectToDB } from "../utils/connect";
import GeneralLedger, { IGeneralLedger } from "../models/GeneralLedger";

export const AccountForExpenses = async () => {
  try {
    await connectToDB();
    const cashAccount = await Account.findOne({ accountID: "1000" });
    return NextResponse.json({ cashAccount });
  } catch (error) {
    console.log(error);
  }
};

export const getExpense = async () => {
  try {
    await connectToDB();
    const expenses = await GeneralLedger.find();
    let thisExpenses = expenses.filter((data: IGeneralLedger) => {
      let exist = false;

      data.debits.map((dataDebit) => {
        if (dataDebit.accountID.substring(0, 1) == "5") {
          if (dataDebit.accountID != "5100") {
            exist = true;
            return;
          }
        }
      });
      data.credits.map((dataCredit) => {
        if (dataCredit.accountID.substring(0, 1) == "5") {
          if (dataCredit.accountID != "5100") {
            exist = true;
            return;
          }
        }
      });

      if (exist) {
        return data;
      }
    });

    return NextResponse.json({ thisExpenses });
  } catch (error) {
    console.log(error);
  }
};
