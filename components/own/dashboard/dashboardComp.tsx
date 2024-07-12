"use client";
import React from "react";
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

const DashboardComp = ({ chartData }: { chartData: any }) => {
  if (chartData == null) {
    return <LoadingComponent />;
  }
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
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
