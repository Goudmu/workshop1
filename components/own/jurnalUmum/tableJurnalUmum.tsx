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
import { CalendarDaysIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { GetGeneralLedgerData } from "@/lib/mongodb/actions/generalLedgerAction";

export default function TableJurnalUmum() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [ledgerEntries, setledgerEntries] = useState<IGeneralLedger[]>([]);
  const [trigger, setTrigger] = useState(false);

  const startDateHandler = (e: any) => {
    setStartDate(e);
  };
  const endDateHandler = (e: any) => {
    setEndDate(e);
  };

  const getData = async () => {
    if (startDate != null && endDate != null) {
      const newgeneralLedger = await GetGeneralLedgerData({
        startDate,
        endDate,
      });

      if (newgeneralLedger != undefined) {
        newgeneralLedger.sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setledgerEntries(newgeneralLedger);
      }
    }
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
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 font-normal"
            >
              <CalendarDaysIcon className="h-4 w-4" />
              <span>{startDate?.toDateString()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              onDayClick={(e) => startDateHandler(e)}
              selected={startDate}
            />
          </PopoverContent>
        </Popover>
        <span className="text-muted-foreground">to</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 font-normal"
            >
              <CalendarDaysIcon className="h-4 w-4" />
              <span>{endDate?.toDateString()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              onDayClick={(e) => endDateHandler(e)}
              selected={endDate}
            />
          </PopoverContent>
        </Popover>
        <Button onClick={() => getData()}>Filter</Button>
      </div>
      <div className="border rounded-lg overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>General Ledger Information</CardTitle>
          </CardHeader>
          <CardContent>
            {startDate != null && endDate != null ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className=" w-[15%]">Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[15%] text-center">Debit</TableHead>
                    <TableHead className="w-[15%] text-center">
                      Credit
                    </TableHead>
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
                          <TableCell className="py-1">
                            {formattedDate}
                          </TableCell>
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
            ) : (
              <div>Select Date First</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
