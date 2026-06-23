"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  AlertTriangle,
  ArrowUpDown,
  Ban,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Edit,
  FileIcon,
  Loader,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EditTaskAllocation } from "./EditTaskAllocation";

// --- Types ---

export interface Task {
  id: string;
  taskNumber: string;
  taskTitle: string;
  description: string;
  assignType: "teams" | "staffs" | "self";
  assignedTeams: string[];
  assignedStaffs: string[];
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "pending" | "in_progress" | "completed" | "overdue";
  dueDate: string;
  repeatedSetting: string | null;
  fileCount: number;
  delegatedBy: string | null;
  delegatedStatus: string | null;
  postponedBy: string | null;
  postponedDate: string | null;
}

// --- Dummy Data ---

const dummyTasks: Task[] = [
  {
    id: "1",
    taskNumber: "TSK-0001",
    taskTitle: "Install kitchen cabinets",
    description:
      "Install all upper and lower cabinets in unit 4B kitchen following the blueprint measurements.",
    assignType: "teams",
    assignedTeams: ["Alpha Team"],
    assignedStaffs: [],
    priority: "High",
    status: "in_progress",
    dueDate: "2026-06-28",
    repeatedSetting: null,
    fileCount: 2,
    delegatedBy: null,
    delegatedStatus: null,
    postponedBy: null,
    postponedDate: null,
  },
  {
    id: "2",
    taskNumber: "TSK-0002",
    taskTitle: "Paint living room walls",
    description:
      "Apply two coats of premium matte finish paint. Color: Warm Beige #ECB.",
    assignType: "staffs",
    assignedTeams: [],
    assignedStaffs: ["John Smith"],
    priority: "Medium",
    status: "pending",
    dueDate: "2026-07-02",
    repeatedSetting: null,
    fileCount: 0,
    delegatedBy: null,
    delegatedStatus: null,
    postponedBy: null,
    postponedDate: null,
  },
  {
    id: "3",
    taskNumber: "TSK-0003",
    taskTitle: "Fix plumbing leak",
    description:
      "Address water leak under sink in bathroom 2A. Replace PVC pipes and check sealant.",
    assignType: "staffs",
    assignedTeams: [],
    assignedStaffs: ["Mike Johnson"],
    priority: "Urgent",
    status: "in_progress",
    dueDate: "2026-06-25",
    repeatedSetting: null,
    fileCount: 1,
    delegatedBy: "Sarah Davis",
    delegatedStatus: "Accepted",
    postponedBy: null,
    postponedDate: null,
  },
  {
    id: "4",
    taskNumber: "TSK-0004",
    taskTitle: "Install electrical wiring",
    description: "Run conduit and wiring for new office space on floor 3.",
    assignType: "teams",
    assignedTeams: ["Bravo Team"],
    assignedStaffs: [],
    priority: "High",
    status: "pending",
    dueDate: "2026-07-05",
    repeatedSetting: null,
    fileCount: 3,
    delegatedBy: null,
    delegatedStatus: null,
    postponedBy: null,
    postponedDate: null,
  },
  {
    id: "5",
    taskNumber: "TSK-0005",
    taskTitle: "Tile bathroom floor",
    description:
      "Install 12x24 ceramic tiles in master bathroom. Grout color: Warm Grey.",
    assignType: "staffs",
    assignedTeams: [],
    assignedStaffs: ["Sarah Davis"],
    priority: "Medium",
    status: "pending",
    dueDate: "2026-07-10",
    repeatedSetting: null,
    fileCount: 0,
    delegatedBy: null,
    delegatedStatus: null,
    postponedBy: null,
    postponedDate: null,
  },
  {
    id: "6",
    taskNumber: "TSK-0006",
    taskTitle: "Install HVAC system",
    description:
      "Complete ductwork and install new HVAC unit for commercial wing.",
    assignType: "teams",
    assignedTeams: ["Charlie Team"],
    assignedStaffs: [],
    priority: "High",
    status: "completed",
    dueDate: "2026-06-20",
    repeatedSetting: null,
    fileCount: 4,
    delegatedBy: null,
    delegatedStatus: null,
    postponedBy: null,
    postponedDate: null,
  },
  {
    id: "7",
    taskNumber: "TSK-0007",
    taskTitle: "Frame interior walls",
    description: "Frame partition walls for new conference room layout.",
    assignType: "teams",
    assignedTeams: ["Alpha Team"],
    assignedStaffs: [],
    priority: "Low",
    status: "completed",
    dueDate: "2026-06-18",
    repeatedSetting: null,
    fileCount: 0,
    delegatedBy: "John Smith",
    delegatedStatus: "Declined",
    postponedBy: null,
    postponedDate: null,
  },
  {
    id: "8",
    taskNumber: "TSK-0008",
    taskTitle: "Install windows",
    description: "Install double-pane windows in all units on floor 2.",
    assignType: "staffs",
    assignedTeams: [],
    assignedStaffs: ["Tom Wilson"],
    priority: "Medium",
    status: "in_progress",
    dueDate: "2026-06-30",
    repeatedSetting: null,
    fileCount: 2,
    delegatedBy: null,
    delegatedStatus: null,
    postponedBy: null,
    postponedDate: null,
  },
  {
    id: "9",
    taskNumber: "TSK-0009",
    taskTitle: "Paint exterior trim",
    description:
      "Apply weather-resistant paint to all exterior window trims and fascia.",
    assignType: "self",
    assignedTeams: [],
    assignedStaffs: [],
    priority: "Low",
    status: "pending",
    dueDate: "2026-07-15",
    repeatedSetting: "1-week",
    fileCount: 1,
    delegatedBy: null,
    delegatedStatus: null,
    postponedBy: null,
    postponedDate: null,
  },
  {
    id: "10",
    taskNumber: "TSK-0010",
    taskTitle: "Install bathroom vanity",
    description:
      "Install custom vanity unit with quartz countertop in master ensuite.",
    assignType: "staffs",
    assignedTeams: [],
    assignedStaffs: ["Emily Brown"],
    priority: "Medium",
    status: "overdue",
    dueDate: "2026-06-15",
    repeatedSetting: null,
    fileCount: 0,
    delegatedBy: null,
    delegatedStatus: null,
    postponedBy: "Project Manager",
    postponedDate: "2026-06-20",
  },
  {
    id: "11",
    taskNumber: "TSK-0011",
    taskTitle: "Drywall finishing",
    description:
      "Tape, mud, and sand all drywall joints in the newly framed office area.",
    assignType: "teams",
    assignedTeams: ["Delta Team"],
    assignedStaffs: [],
    priority: "High",
    status: "overdue",
    dueDate: "2026-06-10",
    repeatedSetting: null,
    fileCount: 0,
    delegatedBy: null,
    delegatedStatus: null,
    postponedBy: "Site Supervisor",
    postponedDate: "2026-06-15",
  },
  {
    id: "12",
    taskNumber: "TSK-0012",
    taskTitle: "Install light fixtures",
    description: "Mount and wire LED panel lights in all corridor areas.",
    assignType: "self",
    assignedTeams: [],
    assignedStaffs: [],
    priority: "Low",
    status: "pending",
    dueDate: "2026-07-20",
    repeatedSetting: null,
    fileCount: 0,
    delegatedBy: null,
    delegatedStatus: null,
    postponedBy: null,
    postponedDate: null,
  },
  {
    id: "13",
    taskNumber: "TSK-0013",
    taskTitle: "Build deck",
    description:
      "Construct rear deck with composite decking material and steel railing.",
    assignType: "teams",
    assignedTeams: ["Alpha Team"],
    assignedStaffs: [],
    priority: "Urgent",
    status: "pending",
    dueDate: "2026-07-01",
    repeatedSetting: null,
    fileCount: 3,
    delegatedBy: "Emily Brown",
    delegatedStatus: "Pending",
    postponedBy: null,
    postponedDate: null,
  },
  {
    id: "14",
    taskNumber: "TSK-0014",
    taskTitle: "Install countertops",
    description:
      "Measure and install granite countertops in kitchen and butler's pantry.",
    assignType: "staffs",
    assignedTeams: [],
    assignedStaffs: ["Jack Turner"],
    priority: "High",
    status: "in_progress",
    dueDate: "2026-06-29",
    repeatedSetting: "1-day",
    fileCount: 1,
    delegatedBy: null,
    delegatedStatus: null,
    postponedBy: null,
    postponedDate: null,
  },
  {
    id: "15",
    taskNumber: "TSK-0015",
    taskTitle: "Landscaping front yard",
    description:
      "Complete front yard landscaping including sod, shrubs, and irrigation system.",
    assignType: "teams",
    assignedTeams: ["Echo Team"],
    assignedStaffs: [],
    priority: "Medium",
    status: "pending",
    dueDate: "2026-07-12",
    repeatedSetting: null,
    fileCount: 2,
    delegatedBy: "Tom Wilson",
    delegatedStatus: "Accepted",
    postponedBy: null,
    postponedDate: null,
  },
  {
    id: "16",
    taskNumber: "TSK-0016",
    taskTitle: "Weekly site cleanup",
    description:
      "General cleanup and debris removal across all active work areas.",
    assignType: "teams",
    assignedTeams: ["Alpha Team", "Bravo Team"],
    assignedStaffs: [],
    priority: "Low",
    status: "pending",
    dueDate: "2026-06-27",
    repeatedSetting: "1-week",
    fileCount: 0,
    delegatedBy: null,
    delegatedStatus: null,
    postponedBy: null,
    postponedDate: null,
  },
  {
    id: "17",
    taskNumber: "TSK-0017",
    taskTitle: "Inspect fire safety systems",
    description:
      "Monthly inspection of all fire extinguishers, alarms, and sprinkler systems.",
    assignType: "staffs",
    assignedTeams: [],
    assignedStaffs: ["Mike Johnson", "Sarah Davis"],
    priority: "High",
    status: "pending",
    dueDate: "2026-07-01",
    repeatedSetting: "1-month",
    fileCount: 0,
    delegatedBy: null,
    delegatedStatus: null,
    postponedBy: null,
    postponedDate: null,
  },
];

// --- Badge Helpers ---

const STATUS_CONFIG = {
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className:
      "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800",
  },
  in_progress: {
    label: "In Progress",
    icon: Loader,
    className:
      "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className:
      "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800",
  },
  overdue: {
    label: "Overdue",
    icon: AlertTriangle,
    className: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800",
  },
} as const;

const PRIORITY_CONFIG = {
  Low: {
    label: "Low",
    dotColor: "bg-slate-400",
    className:
      "bg-slate-500/10 text-slate-600 border-slate-200 dark:border-slate-700",
  },
  Medium: {
    label: "Medium",
    dotColor: "bg-amber-400",
    className:
      "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800",
  },
  High: {
    label: "High",
    dotColor: "bg-orange-400",
    className:
      "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800",
  },
  Urgent: {
    label: "Urgent",
    dotColor: "bg-red-400",
    className: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800",
  },
} as const;

const REPEAT_LABELS: Record<string, string> = {
  "1-day": "Daily",
  "1-week": "Weekly",
  "1-month": "Monthly",
};

const ASSIGN_LABELS: Record<string, string> = {
  teams: "Teams",
  staffs: "Staffs",
  self: "Self",
};

function StatusBadge({ status }: { status: string }) {
  const config =
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG.pending;
  const Icon = config.icon;
  return (
    <Badge
      variant="outline"
      className={`gap-1 text-[10px] px-2 py-0.5 font-medium ${config.className}`}
    >
      <Icon className="size-3" />
      {config.label}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const config =
    PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG] ??
    PRIORITY_CONFIG.Low;
  return (
    <Badge
      variant="outline"
      className={`gap-1.5 text-[10px] px-2 py-0.5 font-medium ${config.className}`}
    >
      <span className={`size-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </Badge>
  );
}

// --- Search Input ---

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search tasks..."}
        className="h-10 w-full max-w-xs rounded-full border border-border bg-card pl-10 pr-9 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

// --- Columns ---

function getColumns(): ColumnDef<Task>[] {
  return [
    {
      accessorKey: "taskNumber",
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary"
        >
          Task #
          <ArrowUpDown className="size-3" />
        </button>
      ),
      cell: ({ getValue }) => (
        <span className="font-mono text-[10px] font-bold text-primary">
          {getValue() as string}
        </span>
      ),
      size: 100,
    },
    {
      accessorKey: "taskTitle",
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary"
        >
          Task Title
          <ArrowUpDown className="size-3" />
        </button>
      ),
      cell: ({ getValue }) => (
        <span className="text-xs font-medium text-foreground">
          {getValue() as string}
        </span>
      ),
      size: 180,
    },
    {
      accessorKey: "description",
      header: () => (
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Description
        </span>
      ),
      cell: ({ getValue }) => {
        const desc = getValue() as string;
        return (
          <span className="text-[10px] text-muted-foreground truncate block max-w-[200px]">
            {desc}
          </span>
        );
      },
      size: 200,
      enableSorting: false,
    },
    {
      id: "assign",
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary"
        >
          Assign
          <ArrowUpDown className="size-3" />
        </button>
      ),
      accessorFn: (row) => row.assignType,
      cell: ({ row }) => {
        const type = row.original.assignType;
        const teams = row.original.assignedTeams;
        const staffs = row.original.assignedStaffs;
        const names =
          type === "teams"
            ? teams.join(", ")
            : type === "staffs"
              ? staffs.join(", ")
              : "Yourself";
        return (
          <div className="flex items-center gap-1.5 min-w-0">
            <Badge
              variant="outline"
              className="text-[9px] px-1.5 py-0.5 rounded-sm border-border font-medium shrink-0"
            >
              {ASSIGN_LABELS[type] ?? type}
            </Badge>
            <span className="text-[9px] text-muted-foreground truncate">
              {names}
            </span>
          </div>
        );
      },
      size: 150,
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary"
        >
          Priority
          <ArrowUpDown className="size-3" />
        </button>
      ),
      cell: ({ getValue }) => <PriorityBadge priority={getValue() as string} />,
      size: 100,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary"
        >
          Status
          <ArrowUpDown className="size-3" />
        </button>
      ),
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
      size: 120,
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary"
        >
          Due Date
          <ArrowUpDown className="size-3" />
        </button>
      ),
      cell: ({ getValue }) => {
        const val = getValue() as string;
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(date);
        due.setHours(0, 0, 0, 0);
        const isOverdue = due < today;
        return (
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3 text-muted-foreground" />
            <span
              className={`text-[10px] ${
                isOverdue
                  ? "text-red-500 font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        );
      },
      size: 130,
      sortingFn: (rowA, rowB) => {
        const a = new Date(rowA.getValue("dueDate") as string).getTime();
        const b = new Date(rowB.getValue("dueDate") as string).getTime();
        return a - b;
      },
    },
    {
      id: "repeated",
      accessorFn: (row) => row.repeatedSetting,
      header: () => (
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Repeated
        </span>
      ),
      cell: ({ getValue }) => {
        const val = getValue() as string | null;
        if (!val) {
          return <span className="text-[10px] text-muted-foreground">—</span>;
        }
        return (
          <div className="flex items-center gap-1">
            <RefreshCw className="size-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">
              {REPEAT_LABELS[val] ?? val}
            </span>
          </div>
        );
      },
      size: 100,
      enableSorting: false,
    },
    {
      id: "files",
      accessorFn: (row) => row.fileCount,
      header: () => (
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Files
        </span>
      ),
      cell: ({ getValue }) => {
        const count = getValue() as number;
        if (count === 0) {
          return <span className="text-[10px] text-muted-foreground">—</span>;
        }
        return (
          <div className="flex items-center gap-1">
            <FileIcon className="size-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">{count}</span>
          </div>
        );
      },
      size: 70,
      enableSorting: false,
    },

    {
      id: "delegatedBy",
      accessorFn: (row) => row.delegatedBy,
      header: () => (
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Delegated By
        </span>
      ),
      cell: ({ getValue }) => {
        const val = getValue() as string | null;
        if (!val) {
          return <span className="text-[10px] text-muted-foreground">—</span>;
        }
        return (
          <div className="flex items-center gap-1">
            <UserCheck className="size-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">{val}</span>
          </div>
        );
      },
      size: 120,
      enableSorting: false,
    },
    {
      id: "delegatedStatus",
      accessorFn: (row) => row.delegatedStatus,
      header: () => (
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Delegated Status
        </span>
      ),
      cell: ({ getValue }) => {
        const val = getValue() as string | null;
        if (!val) {
          return <span className="text-[10px] text-muted-foreground">—</span>;
        }
        const isAccepted = val === "Accepted";
        return (
          <Badge
            variant="outline"
            className={`text-[10px] px-2 py-0.5 font-medium gap-1 ${
              isAccepted
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
                : val === "Declined"
                  ? "bg-red-500/10 text-red-600 border-red-200"
                  : "bg-amber-500/10 text-amber-600 border-amber-200"
            }`}
          >
            {isAccepted ? (
              <CheckCircle2 className="size-3" />
            ) : (
              <Ban className="size-3" />
            )}
            {val}
          </Badge>
        );
      },
      size: 130,
      enableSorting: false,
    },
    {
      id: "postponedBy",
      accessorFn: (row) => row.postponedBy,
      header: () => (
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Postponed By
        </span>
      ),
      cell: ({ getValue }) => {
        const val = getValue() as string | null;
        if (!val) {
          return <span className="text-[10px] text-muted-foreground">—</span>;
        }
        return (
          <div className="flex items-center gap-1">
            <Ban className="size-3 text-amber-500" />
            <span className="text-[10px] text-muted-foreground">{val}</span>
          </div>
        );
      },
      size: 130,
      enableSorting: false,
    },
    {
      id: "postponedDate",
      accessorFn: (row) => row.postponedDate,
      header: () => (
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Postponed Date
        </span>
      ),
      cell: ({ getValue }) => {
        const val = getValue() as string | null;
        if (!val) {
          return <span className="text-[10px] text-muted-foreground">—</span>;
        }
        const date = new Date(val);
        return (
          <div className="flex items-center gap-1">
            <Calendar className="size-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        );
      },
      size: 130,
      enableSorting: false,
    },
    {
      id: "actions",
      header: () => (
        <span className="text-primary text-[10px] font-bold uppercase tracking-wider">
          Actions
        </span>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5">
          <EditTaskAllocation task={row.original}>
            <button
              type="button"
              className="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors"
              title="Edit task"
            >
              <Edit className="size-3.5" />
            </button>
          </EditTaskAllocation>
          <button
            type="button"
            className="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-red-500/10 hover:text-red-600 transition-colors"
            title="Delete task"
          >
            <Trash2 className="size-3.5" />
          </button>
          <button
            type="button"
            className="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-blue-500/10 hover:text-blue-600 transition-colors"
            title="Verify task"
          >
            <ShieldCheck className="size-3.5" />
          </button>
        </div>
      ),
      size: 120,
      enableSorting: false,
    },
  ];
}

// --- Skeleton ---

const SKELETON_HEADERS = [
  "Task #",
  "Task Title",
  "Description",
  "Assign",
  "Priority",
  "Status",
  "Due Date",
  "Repeated",
  "Files",
  "Delegated By",
  "Delegated Status",
  "Postponed By",
  "Postponed Date",
  "Actions",
];

export function TaskTableSkeleton() {
  return (
    <div className="flex flex-col gap-3 bg-neutral-100 dark:bg-neutral-900 shadow-sm rounded-xl p-5 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-28" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="w-full overflow-hidden rounded-lg border border-border">
        <div className="border-b border-border bg-emerald-500/10">
          <div className="flex gap-2 px-3 py-2.5">
            {SKELETON_HEADERS.map((h) => (
              <div key={h} className="flex items-center bg-emerald-500/10">
                <span className="text-secondary-foreground/80 text-[0.8125rem] font-normal">
                  {h}
                </span>
              </div>
            ))}
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`sk-${String(i)}`}
            className="flex gap-2 border-b border-border px-3 py-3 last:border-b-0"
          >
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[180px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-5 w-[150px] rounded-full" />
            <Skeleton className="h-5 w-[100px] rounded-full" />
            <Skeleton className="h-5 w-[120px] rounded-full" />
            <Skeleton className="h-4 w-[130px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[70px]" />
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-5 w-[130px] rounded-full" />
            <Skeleton className="h-4 w-[130px]" />
            <Skeleton className="h-4 w-[130px]" />
            <div className="flex gap-0.5">
              <Skeleton className="size-7 rounded-md" />
              <Skeleton className="size-7 rounded-md" />
              <Skeleton className="size-7 rounded-md" />
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-14 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="size-7 rounded-md" />
            <Skeleton className="size-7 rounded-md" />
            <Skeleton className="size-7 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---

interface TaskTableProps {
  title?: string;
  data?: Task[];
  isLoading?: boolean;
}

export function TaskTable({
  title = "Tasks Overview",
  data: dataProp,
  isLoading,
}: TaskTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [staffFilter, setStaffFilter] = useState("");

  const data = dataProp ?? dummyTasks;

  const staffOptions = useMemo(() => {
    const names = new Set<string>();
    for (const task of data) {
      for (const name of task.assignedStaffs) {
        names.add(name);
      }
    }
    return Array.from(names).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    if (!staffFilter) return data;
    return data.filter((task) =>
      task.assignedStaffs.some(
        (name) => name.toLowerCase() === staffFilter.toLowerCase(),
      ),
    );
  }, [data, staffFilter]);

  const columns = useMemo(() => getColumns(), []);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  if (isLoading) {
    return <TaskTableSkeleton />;
  }

  const totalRecords = table.getFilteredRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="flex flex-col gap-3 bg-neutral-100 dark:bg-neutral-900 shadow-sm rounded-xl p-5 min-w-0 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm md:text-base font-semibold text-foreground">
            {title}
          </h2>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {totalRecords} task{totalRecords !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? "all"
            }
            onValueChange={(val) =>
              table
                .getColumn("status")
                ?.setFilterValue(val === "all" ? undefined : val)
            }
          >
            <SelectTrigger className="h-8 w-[135px] text-[10px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={
              (table.getColumn("priority")?.getFilterValue() as string) ?? "all"
            }
            onValueChange={(val) =>
              table
                .getColumn("priority")
                ?.setFilterValue(val === "all" ? undefined : val)
            }
          >
            <SelectTrigger className="h-8 w-[135px] text-[10px]">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={staffFilter || "all"}
            onValueChange={(val) => setStaffFilter(val === "all" ? "" : val)}
          >
            <SelectTrigger className="h-8 w-[135px] text-[10px]">
              <SelectValue placeholder="All Staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff</SelectItem>
              {staffOptions.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <SearchInput
            value={globalFilter}
            onChange={setGlobalFilter}
            placeholder="Search tasks..."
          />
        </div>
      </div>

      <div className="w-full overflow-auto rounded-lg border border-border bg-card">
        <div className="min-w-[1400px]">
          <div className="border-b border-border bg-emerald-500/10">
            <div className="flex">
              {table.getHeaderGroups()[0]?.headers.map((header) => (
                <div
                  key={header.id}
                  className="flex items-center px-3 py-2.5 shrink-0 bg-emerald-500/10"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder
                    ? null
                    : header.column.columnDef.header?.({
                        column: header.column,
                        header,
                        table,
                      })}
                </div>
              ))}
            </div>
          </div>

          {table.getRowModel().rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="size-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                No tasks found
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className="flex border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className="flex items-center px-3 py-3 shrink-0"
                    style={{ width: cell.column.getSize() }}
                  >
                    {cell.column.columnDef.cell?.({
                      ...cell.getContext(),
                      getValue: cell.getValue,
                    })}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            Page {pageIndex + 1} of {totalPages}
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="h-8 w-16 rounded-md border border-border bg-card text-[10px] text-foreground px-1 outline-none"
          >
            {[5, 10, 25].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsLeft className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <div className="flex items-center gap-1 px-2">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (pageIndex < 2) {
                pageNum = i;
              } else if (pageIndex > totalPages - 3) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = pageIndex - 2 + i;
              }
              return (
                <button
                  key={String(pageNum)}
                  type="button"
                  onClick={() => table.setPageIndex(pageNum)}
                  className={`size-7 inline-flex items-center justify-center rounded-md text-[10px] font-medium transition-colors ${
                    pageNum === pageIndex
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
