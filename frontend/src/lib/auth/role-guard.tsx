"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

interface RoleGuardProps {
  allowedRoles: string[];
  children: ReactNode;
}

function getAccountType(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)account_type=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const accountType = getAccountType();

    if (!accountType) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(accountType)) {
      router.replace(`/${accountType}/dashboard`);
    }
  }, [allowedRoles, router]);

  return <>{children}</>;
}
