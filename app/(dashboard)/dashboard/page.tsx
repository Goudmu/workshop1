import DashboardComp from "@/components/own/dashboard/dashboardComp";
import { getLabaRugiData } from "@/lib/mongodb/actions/dashboardAction";
import { getDayName } from "@/lib/utils";
import React from "react";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

export type IchartData = {
  day: any;
  service: number;
  retail: number;
  expense: number;
};

const DashboardPage = async () => {
  let chartDatas = await getLabaRugiData();
  chartDatas = chartDatas?.map((dataChart) => {
    let modifiedData = {
      day: dataChart.day,
      service: dataChart.service,
      retail: dataChart.retail,
      expense: dataChart.expense,
    };
    modifiedData.day = getDayName(modifiedData.day, "id-ID");

    return modifiedData;
  });

  return (
    <div className=" flex flex-col w-full justify-center items-center ">
      <div className=" w-full text-center">
        <h1>DASHBOARD PAGE</h1>
      </div>
      <div className=" w-[75%]">
        <DashboardComp chartData={chartDatas} />
      </div>
    </div>
  );
};

export default DashboardPage;
