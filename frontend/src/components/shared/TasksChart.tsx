"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import type { PieSectorShapeProps } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Task {
  id: string;
  title?: string;
  status: "completed" | "pending" | "in_progress";
  created_at?: string;
  due_date?: string;
}

interface TasksChartProps {
  tasks: Task[];
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function TasksChart({ tasks }: TasksChartProps) {
  const id = "tasks-chart";
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const [selectedMonthIndex, setSelectedMonthIndex] =
    React.useState(currentMonth);

  const monthlyTasks = React.useMemo(
    () =>
      tasks.filter((t) => {
        if (!t.created_at) return false;
        const d = new Date(t.created_at);
        return (
          d.getMonth() === selectedMonthIndex && d.getFullYear() === currentYear
        );
      }),
    [tasks, selectedMonthIndex, currentYear],
  );

  const counts = React.useMemo(() => {
    const completed = monthlyTasks.filter(
      (t) => t.status === "completed",
    ).length;
    const pending = monthlyTasks.filter((t) => t.status === "pending").length;
    const inProgress = monthlyTasks.filter(
      (t) => t.status === "in_progress",
    ).length;
    const overdue = monthlyTasks.filter((t) => {
      if (!t.due_date || t.status === "completed") return false;
      return new Date(t.due_date) < new Date();
    }).length;
    return { completed, pending, inProgress, overdue };
  }, [monthlyTasks]);

  const chartData = React.useMemo(
    () =>
      [
        {
          status: "completed",
          value: counts.completed,
          fill: "var(--color-completed)",
        },
        {
          status: "pending",
          value: counts.pending,
          fill: "var(--color-pending)",
        },
        {
          status: "in_progress",
          value: counts.inProgress,
          fill: "var(--color-in_progress)",
        },
        { status: "overdue", value: counts.overdue, fill: "#dc2626" },
      ].filter((d) => d.value > 0),
    [counts],
  );

  const chartConfig = {
    completed: { label: "Completed", color: "var(--chart-1)" },
    pending: { label: "Pending", color: "var(--chart-5)" },
    in_progress: { label: "In Progress", color: "var(--chart-3)" },
    overdue: { label: "Overdue", color: "#dc2626" },
  } satisfies ChartConfig;

  const [activeStatus, setActiveStatus] = React.useState<string>(
    chartData.length > 0 ? chartData[0].status : "completed",
  );

  React.useEffect(() => {
    if (chartData.length > 0) {
      setActiveStatus(chartData[0].status);
    }
  }, [chartData]);

  const activeIndex = React.useMemo(
    () => chartData.findIndex((d) => d.status === activeStatus),
    [activeStatus, chartData],
  );

  const total = React.useMemo(
    () => chartData.reduce((sum, d) => sum + d.value, 0),
    [chartData],
  );

  const renderPieShape = React.useCallback(
    ({ index, outerRadius = 0, ...props }: PieSectorShapeProps) => {
      if (index === activeIndex) {
        return (
          <g>
            <Sector {...props} outerRadius={outerRadius + 8} />
            <Sector
              {...props}
              outerRadius={outerRadius + 18}
              innerRadius={outerRadius + 12}
            />
          </g>
        );
      }
      return <Sector {...props} outerRadius={outerRadius} />;
    },
    [activeIndex],
  );

  if (total === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="flex-row items-start space-y-0 pb-0">
          <div className="grid gap-1">
            <CardTitle>Tasks Overview</CardTitle>
            <CardDescription>Monthly task distribution</CardDescription>
          </div>
          <MonthSelect
            months={months}
            value={selectedMonthIndex}
            onChange={setSelectedMonthIndex}
          />
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center pb-0 pt-6">
          <p className="text-xs font-medium text-muted-foreground">
            No tasks found for this month
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Tasks Overview</CardTitle>
          <CardDescription>Monthly task distribution</CardDescription>
        </div>
        <MonthSelect
          months={months}
          value={selectedMonthIndex}
          onChange={setSelectedMonthIndex}
        />
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
              shape={renderPieShape}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const active =
                      chartData[activeIndex >= 0 ? activeIndex : 0];
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {active ? active.value.toLocaleString() : "0"}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-xs"
                        >
                          {active
                            ? (chartConfig[
                                active.status as keyof typeof chartConfig
                              ]?.label ?? "Tasks")
                            : "Tasks"}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

interface MonthSelectProps {
  months: string[];
  value: number;
  onChange: (index: number) => void;
}

function MonthSelect({ months, value, onChange }: MonthSelectProps) {
  return (
    <Select value={value.toString()} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger
        className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
        aria-label="Select a month"
      >
        <SelectValue placeholder="Select month" />
      </SelectTrigger>
      <SelectContent align="end" className="rounded-xl">
        {months.map((month) => (
          <SelectItem
            key={month}
            value={months.indexOf(month).toString()}
            className="rounded-lg"
          >
            <div className="flex items-center gap-2 text-xs">{month}</div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
