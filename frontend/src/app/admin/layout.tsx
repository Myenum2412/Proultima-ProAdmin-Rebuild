import type { Metadata } from "next";
import { AdminAppSidebar } from "@/components/admin-app-sidebar";
import { AppProviders } from "@/components/providers";
import { ModuleHeader } from "@/components/shared/layout/ModuleHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
// import { RoleGuard } from "@/lib/auth/role-guard";

export const metadata: Metadata = {
  title: "Admin | ProUltima ERP",
  description: "Admin module — manage users, tasks, and organization settings",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      {/* <RoleGuard allowedRoles={["admin"]}> */}
      <TooltipProvider>
        <SidebarProvider>
          <AdminAppSidebar />
          <SidebarInset>
            <ModuleHeader
              breadcrumbLink="/admin/dashboard"
              breadcrumbLabel="Admin"
              avatarFallback="A"
            />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
      {/* </RoleGuard> */}
    </AppProviders>
  );
}
