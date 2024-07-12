"use client";
import React, { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import LoadingComponent from "../loading";
import { getDayName } from "@/lib/utils";

const chartConfig = {
  service: {
    label: "service",
    color: "#2563eb",
  },
  retail: {
    label: "retail",
    color: "#60a5fa",
  },
  expense: {
    label: "expense",
    color: "#ef4444",
  },
} satisfies ChartConfig;

const DashboardComp = () => {
  const [chartData, setchartData] = useState(null);

  const getData = async () => {
    try {
      const res = await fetch(`/api/dashboard`, { cache: "no-store" });
      let { chartData } = await res.json();
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
      setchartData(chartData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (chartData == null) {
    return <LoadingComponent />;
  }
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickMargin={10}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="service" fill="var(--color-service)" radius={4} />
        <Bar dataKey="retail" fill="var(--color-retail)" radius={4} />
        <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};

export default DashboardComp;
