"use client";

import LaporanLabaRugi from "@/components/own/report/LaporanLabaRugi";
import {
  getIncomeAccount,
  getLabaRugiData,
} from "@/lib/mongodb/actions/reportAction";
import { IAccount } from "@/lib/mongodb/models/Account";
import React, { useEffect, useState } from "react";

const ReportPage = () => {
  const [incomeAccount, setincomeAccount] = useState<IAccount[]>([]);

  const getDataIncomeAccount = async () => {
    const { incomeAccountFix }: any = await getLabaRugiData();
    setincomeAccount(incomeAccountFix);
  };

  useEffect(() => {
    getDataIncomeAccount();
  }, []);

  return (
    <div className=" flex flex-col justify-center items-center">
      <div>
        <h1>Report Page</h1>
      </div>
      <LaporanLabaRugi incomeAccount={incomeAccount} />
    </div>
  );
};

export default ReportPage;
