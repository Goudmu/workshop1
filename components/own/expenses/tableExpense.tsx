"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { capitalizeFirstLetter, IDRFormat } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import AlertDelete from "../alertDelete";
import { IGeneralLedger } from "@/lib/mongodb/models/GeneralLedger";

export default function TableExpense({
  thisExpenses,
}: {
  thisExpenses: IGeneralLedger[];
}) {
  const [trigger, setTrigger] = useState(false);

  const deleteHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    try {
      const res = await fetch("/api/generalLedger", {
        method: "DELETE",
        body: JSON.stringify({
          _id: e.currentTarget.id,
        }),
      });
      if (res.ok) {
        setTrigger(!trigger);
        toast({ title: "The Ledger Has Deleted" });
      }
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className=" w-[15%]">Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[15%] text-center">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {thisExpenses.map((expense, index) => {
              const entryDate = new Date(expense.date);
              const formattedDate = `${entryDate.getDate()}-${
                entryDate.getMonth() + 1
              }-${entryDate.getFullYear()}`;
              let amount = 0;
              expense.debits.map((data) => {
                if (
                  data.accountID.substring(0, 1) == "5" &&
                  data.accountID != "5100"
                ) {
                  amount += data.amount;
                }
              });
              return (
                <React.Fragment key={index}>
                  <TableRow key={index}>
                    <TableCell className="py-1">{formattedDate}</TableCell>
                    <TableCell className="py-1 font-bold">
                      {expense.description}
                    </TableCell>
                    <TableCell className="py-1">{IDRFormat(amount)}</TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
