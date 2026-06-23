import { AdminTasksCards } from "./components/AdminTasksCards";
import TaskHeader from "./components/TaskHeader";
import { TaskTable } from "./components/TaskTable";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 overflow-hidden">
      <div className="bg-dash border border-border rounded-lg">
        <TaskHeader />
        <AdminTasksCards />
      </div>
      <div className="max-w-[305px] mx-auto w-full overflow-hidden">
        <TaskTable />
      </div>
    </div>
  );
}
