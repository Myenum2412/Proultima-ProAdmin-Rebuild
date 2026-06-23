import {
  AlertTriangle,
  CheckCircle,
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
    title: "Today's My Tasks",
    value: 12,
    icon: <CheckCircle className="size-7 rounded-full bg-primary/10 p-1" />,
  },
  {
    title: "In Progress",
    value: 8,
    icon: <Loader className="size-7 rounded-full bg-primary/10 p-1" />,
  },
  {
    title: "Total Staff",
    value: 45,
    icon: <Users className="size-7 rounded-full bg-primary/10 p-1" />,
  },
  {
    title: "Today Repeated Tasks",
    value: 5,
    icon: <RefreshCw className="size-7 rounded-full bg-primary/10 p-1" />,
  },
  {
    title: "Overdue Tasks",
    value: 3,
    icon: <AlertTriangle className="size-7 rounded-full bg-primary/10 p-1" />,
  },
];

interface AdminDashCardsProps {
  data?: Partial<Record<string, string | number>>;
}

export function AdminDashCards({ data }: AdminDashCardsProps) {
  return (
    <div className="my-5 px-4 md:px-6">
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-5 gap-4">
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
