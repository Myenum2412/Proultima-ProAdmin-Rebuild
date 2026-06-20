"use client";

import {
  BarChart3Icon,
  BookOpenIcon,
  Building2Icon,
  LayoutDashboardIcon,
  ListTodoIcon,
  PackageIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Staff User",
    email: "staff@proultima.com",
    avatar: "/avatars/staff.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/staff/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Tasks",
      url: "/staff/tasks",
      icon: ListTodoIcon,
    },
    {
      title: "Teams",
      url: "/staff/teams",
      icon: UsersIcon,
    },
    {
      title: "Cash Book",
      url: "/staff/cash-book",
      icon: BookOpenIcon,
    },
    {
      title: "Assets Maintenances",
      url: "/staff/assets-maintenances",
      icon: PackageIcon,
    },
    {
      title: "Vendors",
      url: "/staff/vendors",
      icon: Building2Icon,
    },
    {
      title: "Reports",
      url: "/staff/reports",
      icon: BarChart3Icon,
    },
    {
      title: "Settings",
      url: "/staff/settings",
      icon: SettingsIcon,
    },
  ],
};

export function StaffAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      {...props}
      variant="inset"
      collapsible="icon"
      className="bg-neutral-100"
    >
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/staff/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src="/logo.png"
                    alt="Proultima"
                    width={32}
                    height={32}
                    className="rounded"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Proultima</span>
                  <span className="">Staff</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
