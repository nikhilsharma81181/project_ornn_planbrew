"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Activity } from "lucide-react";
import { signOut } from "@/lib/firebase";
import { clearStoredToken } from "@/lib/api";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isLoggedIn: boolean;
}

export function Header({ isLoggedIn }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <Activity className="h-5 w-5 text-primary" />
          <span>PlanBrew</span>
        </Link>

        {isLoggedIn && (
          <nav className="flex items-center gap-1">
            <Link
              href="/dashboard"
              className={cn(
                "px-3 py-1.5 rounded-md text-sm transition-colors",
                pathname === "/dashboard"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/setup"
              className={cn(
                "px-3 py-1.5 rounded-md text-sm transition-colors",
                pathname === "/setup"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Setup
            </Link>
            <button
              onClick={() => { clearStoredToken(); signOut(); }}
              className="ml-2 p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
