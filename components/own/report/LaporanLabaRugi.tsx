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

const LaporanLabaRugi = ({ incomeAccount }: { incomeAccount: IAccount[] }) => {
  const [total, setTotal] = useState({ grossPL: 0, costPL: 0 });

  const getTotal = () => {
    let newTotal = {
      grossPL: 0,
      costPL: 0,
    };

    incomeAccount.map((dataAcc) => {
      if (dataAcc.accountID.substring(0, 1) == "4") {
        newTotal.grossPL += dataAcc.amount;
      } else {
        newTotal.costPL += dataAcc.amount;
      }
      return dataAcc;
    });

    setTotal(newTotal);
  };

  useEffect(() => {
    getTotal();
  }, [incomeAccount]);

  return (
    <div className=" w-full">
      <Card>
        <CardHeader>
          <CardTitle>Income Statement</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              {incomeAccount &&
                incomeAccount.map((dataAccount, index) => {
                  return (
                    <div className="flex justify-between" key={index}>
                      <div className=" w-[75%]">
                        <span>{capitalizeFirstLetter(dataAccount.name)}</span>
                      </div>
                      <div
                        className={` w-[25%] ${
                          dataAccount.accountID.substring(0, 1) == "4"
                            ? ""
                            : "text-end"
                        }`}
                      >
                        <span>
                          {new Intl.NumberFormat("id", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(dataAccount.amount)}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between font-semibold">
                <span>Net Income</span>
                <span className={` font-bold`}>
                  {new Intl.NumberFormat("id", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(total.grossPL - total.costPL)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaporanLabaRugi;
