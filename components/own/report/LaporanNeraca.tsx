import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IAccount } from "@/lib/mongodb/models/Account";
import { capitalizeFirstLetter } from "@/lib/utils";
import React, { useEffect, useState } from "react";

const LaporanNeraca = ({ neracaAccount }: { neracaAccount: IAccount[] }) => {
  const [total, setTotal] = useState({
    totalAsset: 0,
    totalEquityandLiability: 0,
    totalPL: 0,
  });

  const getTotal = () => {
    let newTotal = {
      totalAsset: 0,
      totalEquityandLiability: 0,
      totalPL: 0,
    };

    neracaAccount.map((dataAcc) => {
      if (dataAcc.accountID.substring(0, 1) == "3") {
        newTotal.totalEquityandLiability += dataAcc.amount;
      } else {
        newTotal.totalAsset += dataAcc.amount;
      }
      return dataAcc;
    });
    newTotal.totalPL = newTotal.totalAsset - newTotal.totalEquityandLiability;

    setTotal(newTotal);
  };

  useEffect(() => {
    getTotal();
  }, [neracaAccount]);

  return (
    <div className=" w-full">
      <Card>
        <CardHeader>
          <CardTitle>Balance Statement</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          {/* ASSET */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              {neracaAccount &&
                neracaAccount.map((dataAccount, index) => {
                  if (["1"].includes(dataAccount.accountID.substring(0, 1))) {
                    return (
                      <div className="flex justify-between" key={index}>
                        <span>{capitalizeFirstLetter(dataAccount.name)}</span>
                        <span>
                          {new Intl.NumberFormat("id", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(dataAccount.amount)}
                        </span>
                      </div>
                    );
                  }
                })}
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between font-semibold">
                <span>Total Asset</span>
                <span className={`font-bold`}>
                  {new Intl.NumberFormat("id", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(total.totalAsset)}
                </span>
              </div>
            </div>
            {/* EQUITY AND LIABILITY */}
            <div className="grid gap-2">
              {neracaAccount &&
                neracaAccount.map((dataAccount, index) => {
                  if (
                    ["2", "3"].includes(dataAccount.accountID.substring(0, 1))
                  ) {
                    return (
                      <div className="flex justify-between" key={index}>
                        <span>{capitalizeFirstLetter(dataAccount.name)}</span>
                        <span>
                          {new Intl.NumberFormat("id", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(
                            dataAccount.accountID == "3200"
                              ? total.totalPL
                              : dataAccount.amount
                          )}
                        </span>
                      </div>
                    );
                  }
                })}
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between font-semibold">
                <span>Total Liability and Equity</span>
                <span className={`font-bold`}>
                  {new Intl.NumberFormat("id", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(total.totalEquityandLiability + total.totalPL)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaporanNeraca;
