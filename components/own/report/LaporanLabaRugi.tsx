import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IAccount } from "@/lib/mongodb/models/Account";
import { capitalizeFirstLetter } from "@/lib/utils";
import React, { useState } from "react";

const LaporanLabaRugi = ({ incomeAccount }: { incomeAccount: IAccount[] }) => {
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
                  if (
                    ["4", "5"].includes(dataAccount.accountID.substring(0, 1))
                  ) {
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
                <span>Net Income</span>
                <span>
                  {new Intl.NumberFormat("id", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(0)}
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
