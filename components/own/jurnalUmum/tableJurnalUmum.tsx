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
import React, { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import AlertDelete from "../alertDelete";
import FormJurnalumum from "./formJurnalUmum";
import { IGeneralLedger } from "@/lib/mongodb/models/GeneralLedger";

export default function TableJurnalUmum() {
  const [ledgerEntries, setledgerEntries] = useState<IGeneralLedger[]>([]);
  const [trigger, setTrigger] = useState(false);

  const getData = async () => {
    const res = await fetch("/api/generalLedger", { cache: "no-store" });
    const { newgeneralLedger, accounts } = await res.json();
    newgeneralLedger.map((dataLedger: IGeneralLedger) => {
      dataLedger.debits.map((dataDebits: any) => {
        accounts.map((dataAccount: any) => {
          if (dataAccount._id.toString() == dataDebits.accountID) {
            dataDebits.accountName = dataAccount.name;
            return;
          }
        });
      });
      dataLedger.credits.map((dataCredits: any) => {
        accounts.map((dataAccount: any) => {
          if (dataAccount._id.toString() == dataCredits.accountID) {
            dataCredits.accountName = dataAccount.name;
            return;
          }
        });
      });
    });
    newgeneralLedger.sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setledgerEntries(newgeneralLedger);
  };

  useEffect(() => {
    getData();
  }, [trigger]);

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
    <div className="grid gap-8">
      <FormJurnalumum setTrigger={setTrigger} trigger={trigger} />
      <div className="border rounded-lg overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>General Ledger Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className=" w-[15%]">Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[15%] text-center">Debit</TableHead>
                  <TableHead className="w-[15%] text-center">Credit</TableHead>
                  <TableHead className="w-[15%] text-center">
                    Edit / Delete
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledgerEntries.map((entry, index) => {
                  const entryDate = new Date(entry.date);
                  const formattedDate = `${entryDate.getDate()}-${
                    entryDate.getMonth() + 1
                  }-${entryDate.getFullYear()}`;
                  return (
                    <React.Fragment key={index}>
                      <TableRow key={index}>
                        <TableCell className="py-1">{formattedDate}</TableCell>
                        <TableCell className="py-1 font-bold">
                          {entry.description}
                        </TableCell>
                        <TableCell className="py-1"></TableCell>
                        <TableCell className="py-1"></TableCell>
                        <TableCell className="py-1">
                          <AlertDelete
                            id={entry._id}
                            deleteFuntion={deleteHandler}
                          />
                        </TableCell>
                      </TableRow>
                      {entry.debits.map((data, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell className="py-1"></TableCell>
                            <TableCell className="py-1">
                              {capitalizeFirstLetter(data.accountName)}
                            </TableCell>
                            <TableCell className="py-1 text-center">
                              {new Intl.NumberFormat("id", {
                                style: "currency",
                                currency: "IDR",
                                maximumFractionDigits: 0,
                              }).format(data.amount)}
                            </TableCell>
                            <TableCell className="py-1"></TableCell>
                          </TableRow>
                        );
                      })}
                      {entry.credits.map((data, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell className="py-1"></TableCell>
                            <TableCell className="py-1">
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              {capitalizeFirstLetter(data.accountName)}
                            </TableCell>
                            <TableCell className="py-1"></TableCell>
                            <TableCell className="py-1 text-center">
                              {new Intl.NumberFormat("id", {
                                style: "currency",
                                currency: "IDR",
                                maximumFractionDigits: 0,
                              }).format(data.amount)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
