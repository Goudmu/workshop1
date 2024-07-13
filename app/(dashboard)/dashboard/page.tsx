import DashboardCard from "@/components/own/dashboard/dashboardCard";
import DashboardComp from "@/components/own/dashboard/dashboardComp";
import { getDayName, WIBOptions } from "@/lib/utils";
import React from "react";

export type IchartData = {
  day: any;
  service: number;
  retail: number;
  expense: number;
};

const getData = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_URL}api/dashboard`,
      { cache: "no-store" }
    );
    let { chartData, incomeAccount } = await res.json();
    chartData = chartData?.map((dataChart: any) => {
      let modifiedData = {
        day: dataChart.day,
        service: dataChart.service,
        retail: dataChart.retail,
        expense: dataChart.expense,
      };
      modifiedData.day = getDayName(modifiedData.day, "id-ID");

      return modifiedData;
    });
    return { chartData, incomeAccount };
  } catch (error) {
    console.log(error);
  }
};

const DashboardPage = async () => {
  const { chartData, incomeAccount }: any = await getData();
  const start = new Date();
  start.setDate(start.getDate() - 6);
  start.setHours(start.getHours() + 7); // Convert to WIB (UTC+7)
  start.setMinutes(0);
  start.setSeconds(0);
  start.setMilliseconds(0);

  const end = new Date();
  end.setHours(end.getHours() + 7); // Convert to WIB (UTC+7)
  end.setMinutes(59);
  end.setSeconds(59);
  end.setMilliseconds(999);

  // Formatting options for the date
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Function to format date in WIB
  const formatDateInWIB = (date: Date): string => {
    return date.toLocaleDateString("en-ID", options);
  };

  // Get formatted dates
  const startFormatted: string = formatDateInWIB(start);
  const endFormatted: string = formatDateInWIB(end);

  return (
    <div className=" flex flex-col w-full justify-center items-center gap-10 ">
      <div className=" w-full text-center">
        <h1 className="font-bold text-2xl">DASHBOARD PAGE</h1>
        <h2 className="font-semibold text-xl">
          Dashboard Page From {startFormatted} To {endFormatted}
        </h2>
      </div>
      <div className=" w-full">
        <DashboardCard incomeAccount={incomeAccount} />
      </div>
      <div className=" w-[75%]">
        <DashboardComp chartData={chartData} />
      </div>
    </div>
  );
};

export default DashboardPage;
