import type { Metadata } from "next";
import { AccountantAppSidebar } from "@/components/accountant-app-sidebar";
import { AppProviders } from "@/components/providers";
import { ModuleHeader } from "@/components/shared/layout/ModuleHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
// import { RoleGuard } from "@/lib/auth/role-guard";

export const metadata: Metadata = {
  title: "Accountant | ProUltima ERP",
  description: "Accountant module — manage cash book, invoices, and reports",
};

export default function AccountantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      {/* <RoleGuard allowedRoles={["accountant"]}> */}
      <TooltipProvider>
        <SidebarProvider>
          <AccountantAppSidebar />
          <SidebarInset>
            <ModuleHeader
              breadcrumbLink="/accountant/dashboard"
              breadcrumbLabel="Accountant"
              avatarFallback="Ac"
            />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
      {/* </RoleGuard> */}
    </AppProviders>
  );
}
