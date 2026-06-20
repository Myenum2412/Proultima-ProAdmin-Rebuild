import type { Metadata } from "next";
import { AppProviders } from "@/components/providers";
import { ModuleHeader } from "@/components/shared/layout/ModuleHeader";
import { StaffAppSidebar } from "@/components/staff-app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
// import { RoleGuard } from "@/lib/auth/role-guard";

export const metadata: Metadata = {
  title: "Staff | ProUltima ERP",
  description: "Staff module — manage tasks, assets, and attendance",
};

export default function StaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      {/* <RoleGuard allowedRoles={["staff"]}> */}
      <TooltipProvider>
        <SidebarProvider>
          <StaffAppSidebar />
          <SidebarInset>
            <ModuleHeader
              breadcrumbLink="/staff/dashboard"
              breadcrumbLabel="Staff"
              avatarFallback="S"
            />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
      {/* </RoleGuard> */}
    </AppProviders>
  );
}
