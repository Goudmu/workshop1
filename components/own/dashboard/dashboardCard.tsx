"use client";
import { Card, CardContent } from "@/components/ui/card";
import { IAccount } from "@/lib/mongodb/models/Account";
import { IDRFormat } from "@/lib/utils";
import React from "react";

const DashboardCard = ({ incomeAccount }: { incomeAccount: IAccount[] }) => {
  return (
    <section className="grid grid-cols-3 gap-6 p-4 md:grid-cols-6 md:p-6">
      {incomeAccount &&
        incomeAccount.map((dataAcc, index) => {
          return (
            <Card
              className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2"
              key={index}
            >
              <span className="sr-only">View</span>
              <CardContent className="p-2 bg-background flex flex-col justify-around">
                <h3 className={`font-semibold capitalize`}>{dataAcc.name}</h3>
                <p
                  className={`font-semibold capitalize ${
                    dataAcc.accountID == "4100"
                      ? "text-[#2563eb]"
                      : dataAcc.accountID == "4200"
                      ? "text-[#60a5fa]"
                      : "text-[#ef4444]"
                  }`}
                >
                  {IDRFormat(dataAcc.amount)}
                </p>
              </CardContent>
            </Card>
          );
        })}
    </section>
  );
};

export default DashboardCard;
