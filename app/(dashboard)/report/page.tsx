"use client";

import LaporanLabaRugi from "@/components/own/report/LaporanLabaRugi";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getIncomeAccount,
  getLabaRugiData,
} from "@/lib/mongodb/actions/reportAction";
import { IAccount } from "@/lib/mongodb/models/Account";
import { CalendarDaysIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

const ReportPage = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(0, 0, 0, 1);
    return endOfDay;
  });
  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 59);
    return endOfDay;
  });
  const [incomeAccount, setincomeAccount] = useState<IAccount[]>([]);

  const startDateHandler = (e: any) => {
    setStartDate(e);
  };
  const endDateHandler = (e: any) => {
    setEndDate(e);
  };

  const getDataIncomeAccount = async () => {
    const { incomeAccountFix }: any = await getLabaRugiData({
      startDate,
      endDate,
    });
    setincomeAccount(incomeAccountFix);
  };

  const filterHandler = () => {
    getDataIncomeAccount();
  };

  useEffect(() => {
    getDataIncomeAccount();
  }, []);

  return (
    <div className=" flex flex-col justify-center items-center gap-10">
      <div>
        <h1>Report Page</h1>
      </div>
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
        <Button onClick={filterHandler}>Filter</Button>
      </div>
      <LaporanLabaRugi incomeAccount={incomeAccount} />
    </div>
  );
};

export default ReportPage;
