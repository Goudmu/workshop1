import Account, { IAccount } from "@/lib/mongodb/models/Account";
import GeneralLedger, {
  IGeneralLedger,
} from "@/lib/mongodb/models/GeneralLedger";
import { connectToDB } from "@/lib/mongodb/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDB();
    const generalLedger = await GeneralLedger.find({ type: "jurnalumum" });
    const adjustLedger = await GeneralLedger.find({
      type: "jurnalpenyesuaian",
    });
    const accounts = await Account.find();

    // CLOSINSG LEDGER
    const closingLedgerAccounts = accounts.filter((dataAccount: IAccount) => {
      if (["4", "5"].includes(dataAccount.accountID.substring(0, 1))) {
        return dataAccount;
      } else if (["3"].includes(dataAccount.accountID.substring(0, 1))) {
        if (dataAccount.accountID == "3100") {
          return dataAccount;
        }
      }
    });
    const closingLedger = generalLedger.filter((data: IGeneralLedger) => {
      let exist = false;
      closingLedgerAccounts.map((dataAccount: any) => {
        data.debits.map((dataDebit) => {
          if (dataAccount._id.toString() == dataDebit.accountID) {
            exist = true;
          }
        });
        data.credits.map((dataCredit) => {
          if (dataAccount._id.toString() == dataCredit.accountID) {
            exist = true;
          }
        });
      });
      if (exist) {
        return data;
      }
    });
    return NextResponse.json({
      generalLedger,
      adjustLedger,
      accounts,
      closingLedger,
    });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
