import DashboardComp from "@/components/own/dashboard/dashboardComp";
import { getLabaRugiData } from "@/lib/mongodb/actions/dashboardAction";
import { getDayName } from "@/lib/utils";
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
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/dashboard`,
      { cache: "no-store" }
    );
    const { chartData } = await res.json();
    return chartData;
  } catch (error) {
    console.log(error);
  }
};

const DashboardPage = async () => {
  //   let chartDatas = await getLabaRugiData();
  //   chartDatas = chartDatas?.map((dataChart) => {
  //     let modifiedData = {
  //       day: dataChart.day,
  //       service: dataChart.service,
  //       retail: dataChart.retail,
  //       expense: dataChart.expense,
  //     };
  //     modifiedData.day = getDayName(modifiedData.day, "id-ID");

  //     return modifiedData;
  //   });
  let chartDatas = await getData();
  chartDatas = chartDatas?.map((dataChart: any) => {
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
