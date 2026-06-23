import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Loader,
  RefreshCw,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const stats: StatCardData[] = [
  {
    title: "Today Tasks",
    value: 0,
    icon: <Calendar className="size-7 rounded-full bg-primary/10 p-1" />,
  },
  {
    title: "In Progress Tasks",
    value: 0,
    icon: <Loader className="size-7 rounded-full bg-primary/10 p-1" />,
  },
  {
    title: "Team Tasks",
    value: 0,
    icon: <Users className="size-7 rounded-full bg-primary/10 p-1" />,
  },
  {
    title: "Pending Approval",
    value: 0,
    icon: <Clock className="size-7 rounded-full bg-primary/10 p-1" />,
  },
  {
    title: "Postponed Tasks",
    value: 0,
    icon: <Clock className="size-7 rounded-full bg-primary/10 p-1" />,
  },
  {
    title: "Repeated Tasks",
    value: 0,
    icon: <RefreshCw className="size-7 rounded-full bg-primary/10 p-1" />,
  },
  {
    title: "Overdue Tasks",
    value: 0,
    icon: <AlertTriangle className="size-7 rounded-full bg-primary/10 p-1" />,
  },
];

interface AdminTasksCardsProps {
  data?: Partial<Record<string, string | number>>;
}

export function AdminTasksCards({ data }: AdminTasksCardsProps) {
  return (
    <div className="my-5 px-4 md:px-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex flex-col justify-between p-3 md:p-5 py-2 md:py-3">
              <div className="flex justify-between items-start w-full">
                <p className="text-sm md:text-base font-semibold text-muted-foreground uppercase">
                  {stat.title}
                </p>
                {stat.icon}
              </div>
              <p className="text-xl md:text-3xl xl:text-4xl font-bold">
                {data?.[stat.title] ?? stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
