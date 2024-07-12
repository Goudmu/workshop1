import DashboardComp from "@/components/own/dashboard/dashboardComp";
import React from "react";

export type IchartData = {
  day: any;
  service: number;
  retail: number;
  expense: number;
};

const DashboardPage = async () => {
  return (
    <div className=" flex flex-col w-full justify-center items-center ">
      <div className=" w-full text-center">
        <h1>DASHBOARD PAGE</h1>
      </div>
      <div className=" w-[75%]">
        <DashboardComp />
      </div>
    </div>
  );
};

export default DashboardPage;
