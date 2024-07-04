import DashboardHeaderOwnComponent from "@/components/own/header/dashboardHeader";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" h-full max-w-[90%] mx-auto relative">
      <DashboardHeaderOwnComponent />
      {children}
    </div>
  );
};

export default DashboardLayout;
