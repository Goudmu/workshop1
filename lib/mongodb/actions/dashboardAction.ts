"use server";

import { IchartData } from "@/app/(dashboard)/dashboard/page";
import Account from "../models/Account";
import GeneralLedger, { IGeneralLedger } from "../models/GeneralLedger";
import { connectToDB } from "../utils/connect";
import { formatDate } from "@/lib/utils";

export const getLabaRugiData = async () => {
  try {
    await connectToDB();
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    const end = new Date();

    let incomeAccount = await Account.find({
      accountID: { $regex: "^[45]" },
    });

    const generalLedgerData = await GeneralLedger.find({
      date: { $gte: start, $lte: end },
      type: "jurnalumum",
      $or: [
        { "debits.accountID": { $regex: "^[45]" } },
        { "credits.accountID": { $regex: "^[45]" } },
      ],
    });

    let chartData: IchartData[] = [];

    for (let i = 0; i < 7; i++) {
      // Calculate the date for this entry
      let currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);

      // Initialize the data object
      let modifiedData: IchartData = {
        day: currentDate,
        service: 0,
        retail: 0,
        expense: 0,
      };

      chartData.push(modifiedData);
    }

    chartData = chartData.map((dataChart) => {
      let modifiedData = {
        day: dataChart.day,
        service: dataChart.service,
        retail: dataChart.retail,
        expense: dataChart.expense,
      };
      generalLedgerData.map((dataGL: IGeneralLedger) => {
        if (formatDate(dataGL.date) == formatDate(modifiedData.day)) {
          dataGL.debits.map((dataDebit) => {
            if (dataDebit.accountID == "4100") {
              modifiedData.service -= dataDebit.amount;
            } else if (dataDebit.accountID == "4200") {
              modifiedData.retail -= dataDebit.amount;
            } else if (dataDebit.accountID.substring(0, 1) == "5") {
              modifiedData.expense += dataDebit.amount;
            }
          });
          dataGL.credits.map((dataCredit) => {
            if (dataCredit.accountID == "4100") {
              modifiedData.service += dataCredit.amount;
            } else if (dataCredit.accountID == "4200") {
              modifiedData.retail += dataCredit.amount;
            } else if (dataCredit.accountID.substring(0, 1) == "5") {
              modifiedData.expense -= dataCredit.amount;
            }
          });
        }
      });

      return modifiedData;
    });

    return chartData;
  } catch (error) {
    console.log(error);
  }
};
