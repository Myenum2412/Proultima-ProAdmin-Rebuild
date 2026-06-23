import { TasksChart } from "@/components/shared/TasksChart";
import { dummyTasks } from "@/lib/dummy-data";
import { AdminDashCards } from "./components/AdminDashCards";
import { DashboardHeader } from "./components/DashboardHeader";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="bg-dash border border-border rounded-lg">
        <DashboardHeader />
        <AdminDashCards />
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TasksChart tasks={dummyTasks} />
        </div>

    </div>
  );
}
