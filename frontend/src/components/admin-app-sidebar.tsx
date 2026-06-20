"use client";

import {
  BarChart3Icon,
  BookOpenIcon,
  Building2Icon,
  LayoutDashboardIcon,
  ListTodoIcon,
  PackageIcon,
  SettingsIcon,
  UserCheckIcon,
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
    name: "Admin User",
    email: "admin@proultima.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Tasks",
      url: "/admin/tasks",
      icon: ListTodoIcon,
    },
    {
      title: "Teams",
      url: "/admin/teams",
      icon: UsersIcon,
    },
    {
      title: "Staffs",
      url: "/admin/staffs",
      icon: UsersIcon,
    },
    {
      title: "Cash Book",
      url: "/admin/cash-book",
      icon: BookOpenIcon,
    },
    {
      title: "Assets Maintenances",
      url: "/admin/assets-maintenances",
      icon: PackageIcon,
    },
    {
      title: "Accountants",
      url: "/admin/accountants",
      icon: UserCheckIcon,
    },
    {
      title: "Vendors",
      url: "/admin/vendors",
      icon: Building2Icon,
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: BarChart3Icon,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: SettingsIcon,
    },
  ],
};

export function AdminAppSidebar({
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
              <Link href="/admin/dashboard">
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
                  <span className="">ProAdmin Software</span>
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
