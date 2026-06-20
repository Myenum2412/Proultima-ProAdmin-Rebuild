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
  WrenchIcon,
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
    name: "Accountant User",
    email: "accountant@proultima.com",
    avatar: "/avatars/accountant.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/accountant/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Tasks",
      url: "/accountant/tasks",
      icon: ListTodoIcon,
    },
    {
      title: "Teams",
      url: "/accountant/teams",
      icon: UsersIcon,
    },
    {
      title: "Cash Book",
      url: "/accountant/cash-book",
      icon: BookOpenIcon,
    },
    {
      title: "Assets",
      url: "/accountant/assets",
      icon: PackageIcon,
    },
    {
      title: "Maintenance",
      url: "/accountant/maintenance",
      icon: WrenchIcon,
    },
    {
      title: "Vendors",
      url: "/accountant/vendors",
      icon: Building2Icon,
    },
    {
      title: "Accountants",
      url: "/accountant/accountants",
      icon: UserCheckIcon,
    },
    {
      title: "Reports",
      url: "/accountant/reports",
      icon: BarChart3Icon,
    },
    {
      title: "Settings",
      url: "/accountant/settings",
      icon: SettingsIcon,
    },
  ],
};

export function AccountantAppSidebar({
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
              <Link href="/accountant/dashboard">
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
                  <span className="">Accountant</span>
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
