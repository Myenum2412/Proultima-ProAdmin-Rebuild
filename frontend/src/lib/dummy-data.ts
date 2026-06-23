import type { Task } from "@/components/shared/TasksChart";

function dateStr(year: number, month: number, day: number) {
  return new Date(year, month, day).toISOString();
}

const currentYear = new Date().getFullYear();

export const dummyTasks: Task[] = [
  // Current month - completed
  {
    id: "1",
    title: "Setup CI/CD pipeline",
    status: "completed",
    created_at: dateStr(currentYear, 5, 1),
    due_date: dateStr(currentYear, 5, 10),
  },
  {
    id: "2",
    title: "Design landing page mockup",
    status: "completed",
    created_at: dateStr(currentYear, 5, 2),
    due_date: dateStr(currentYear, 5, 8),
  },
  {
    id: "3",
    title: "Write unit tests for auth module",
    status: "completed",
    created_at: dateStr(currentYear, 5, 3),
    due_date: dateStr(currentYear, 5, 12),
  },
  {
    id: "4",
    title: "Deploy staging environment",
    status: "completed",
    created_at: dateStr(currentYear, 5, 5),
    due_date: dateStr(currentYear, 5, 15),
  },
  {
    id: "5",
    title: "API rate limiting implementation",
    status: "completed",
    created_at: dateStr(currentYear, 5, 6),
    due_date: dateStr(currentYear, 5, 14),
  },
  {
    id: "6",
    title: "Database backup automation",
    status: "completed",
    created_at: dateStr(currentYear, 5, 8),
    due_date: dateStr(currentYear, 5, 18),
  },

  // Current month - pending
  {
    id: "7",
    title: "Implement user notifications",
    status: "pending",
    created_at: dateStr(currentYear, 5, 10),
    due_date: dateStr(currentYear, 5, 25),
  },
  {
    id: "8",
    title: "Create admin dashboard widgets",
    status: "pending",
    created_at: dateStr(currentYear, 5, 12),
    due_date: dateStr(currentYear, 5, 28),
  },
  {
    id: "9",
    title: "Set up monitoring and alerting",
    status: "pending",
    created_at: dateStr(currentYear, 5, 14),
    due_date: dateStr(currentYear, 5, 30),
  },

  // Current month - in_progress
  {
    id: "10",
    title: "Refactor payment module",
    status: "in_progress",
    created_at: dateStr(currentYear, 5, 4),
    due_date: dateStr(currentYear, 5, 22),
  },
  {
    id: "11",
    title: "Build report generation engine",
    status: "in_progress",
    created_at: dateStr(currentYear, 5, 7),
    due_date: dateStr(currentYear, 5, 26),
  },
  {
    id: "12",
    title: "Integrate third-party analytics",
    status: "in_progress",
    created_at: dateStr(currentYear, 5, 9),
    due_date: dateStr(currentYear, 5, 24),
  },

  // Current month - overdue (due date in past)
  {
    id: "13",
    title: "Fix security vulnerability in auth",
    status: "pending",
    created_at: dateStr(currentYear, 5, 1),
    due_date: dateStr(currentYear, 5, 5),
  },
  {
    id: "14",
    title: "Update dependency licenses",
    status: "in_progress",
    created_at: dateStr(currentYear, 5, 2),
    due_date: dateStr(currentYear, 5, 6),
  },

  // Previous month
  {
    id: "15",
    title: "Migrate legacy database",
    status: "completed",
    created_at: dateStr(currentYear, 4, 5),
    due_date: dateStr(currentYear, 4, 20),
  },
  {
    id: "16",
    title: "Setup error tracking service",
    status: "completed",
    created_at: dateStr(currentYear, 4, 8),
    due_date: dateStr(currentYear, 4, 18),
  },
  {
    id: "17",
    title: "Optimize image loading",
    status: "completed",
    created_at: dateStr(currentYear, 4, 10),
    due_date: dateStr(currentYear, 4, 22),
  },
  {
    id: "18",
    title: "Implement caching layer",
    status: "completed",
    created_at: dateStr(currentYear, 4, 12),
    due_date: dateStr(currentYear, 4, 25),
  },
  {
    id: "19",
    title: "Audit user permissions",
    status: "completed",
    created_at: dateStr(currentYear, 4, 15),
    due_date: dateStr(currentYear, 4, 28),
  },
  {
    id: "20",
    title: "Write API documentation",
    status: "pending",
    created_at: dateStr(currentYear, 4, 18),
    due_date: dateStr(currentYear, 5, 5),
  },
  {
    id: "21",
    title: "Performance benchmarking",
    status: "in_progress",
    created_at: dateStr(currentYear, 4, 20),
    due_date: dateStr(currentYear, 5, 10),
  },
  {
    id: "22",
    title: "Setup email templates",
    status: "pending",
    created_at: dateStr(currentYear, 4, 22),
    due_date: dateStr(currentYear, 5, 8),
  },

  // 2 months ago
  {
    id: "23",
    title: "Configure CDN distribution",
    status: "completed",
    created_at: dateStr(currentYear, 3, 2),
    due_date: dateStr(currentYear, 3, 16),
  },
  {
    id: "24",
    title: "Implement search functionality",
    status: "completed",
    created_at: dateStr(currentYear, 3, 5),
    due_date: dateStr(currentYear, 3, 20),
  },
  {
    id: "25",
    title: "Build onboarding wizard",
    status: "pending",
    created_at: dateStr(currentYear, 3, 10),
    due_date: dateStr(currentYear, 3, 25),
  },
  {
    id: "26",
    title: "Design system color tokens",
    status: "completed",
    created_at: dateStr(currentYear, 3, 12),
    due_date: dateStr(currentYear, 3, 22),
  },
  {
    id: "27",
    title: "Export CSV functionality",
    status: "in_progress",
    created_at: dateStr(currentYear, 3, 15),
    due_date: dateStr(currentYear, 3, 30),
  },

  // 3 months ago
  {
    id: "28",
    title: "Setup project scaffolding",
    status: "completed",
    created_at: dateStr(currentYear, 2, 1),
    due_date: dateStr(currentYear, 2, 10),
  },
  {
    id: "29",
    title: "Configure ESLint and Prettier",
    status: "completed",
    created_at: dateStr(currentYear, 2, 3),
    due_date: dateStr(currentYear, 2, 8),
  },
  {
    id: "30",
    title: "Define data models",
    status: "completed",
    created_at: dateStr(currentYear, 2, 5),
    due_date: dateStr(currentYear, 2, 15),
  },
];
