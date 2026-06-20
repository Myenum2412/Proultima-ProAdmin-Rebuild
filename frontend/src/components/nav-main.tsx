"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ComponentType<{ className?: string }>;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  function isActive(item: (typeof items)[0]): boolean {
    if (pathname === item.url || pathname.startsWith(`${item.url}/`))
      return true;
    if (item.items) {
      return item.items.some(
        (child) =>
          pathname === child.url || pathname.startsWith(`${child.url}/`),
      );
    }
    return false;
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const active = isActive(item);

          if (item.items?.length) {
            return (
              <DropdownMenu key={item.title}>
                <SidebarMenuItem>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      className={cn(
                        "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                        active &&
                          "bg-primary text-white hover:bg-primary/80 hover:text-white",
                      )}
                    >
                      {item.icon && <item.icon className="size-4 shrink-0" />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                    className="min-w-56 rounded-lg"
                  >
                    {item.items.map((child) => {
                      const childActive =
                        pathname === child.url ||
                        pathname.startsWith(`${child.url}/`);
                      return (
                        <DropdownMenuItem asChild key={child.title}>
                          <Link
                            href={child.url}
                            className={cn(
                              childActive &&
                                "bg-primary text-white hover:bg-primary/80 hover:text-white",
                            )}
                          >
                            {child.title}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </SidebarMenuItem>
              </DropdownMenu>
            );
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={cn(
                  active &&
                    "bg-primary text-white hover:bg-primary/80 hover:text-white",
                )}
              >
                <Link href={item.url}>
                  {item.icon && <item.icon className="size-4 shrink-0" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
