"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ADMIN_CONTENT_NAV, ADMIN_MAIN_NAV } from "./config";

const MAIN_ICONS = {
  "/admin": LayoutDashboard,
  "/admin/inquiries": MessageSquare,
  "/admin/media": ImageIcon,
} as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Failed to log out");
    }
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="border-b border-slate-200 px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Pacnix Admin</p>
        <p className="mt-1 text-sm text-slate-500">Content management</p>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto p-4">
        <div>
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Main
          </p>
          <ul className="space-y-1">
            {ADMIN_MAIN_NAV.map((item) => {
              const Icon = MAIN_ICONS[item.href as keyof typeof MAIN_ICONS];
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Content
          </p>
          <ul className="space-y-1">
            {ADMIN_CONTENT_NAV.map((item) => {
              const href = `/admin/content/${item.collection}`;
              return (
                <li key={item.collection}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
                      pathname === href
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="border-t border-slate-200 p-4">
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();

  const pills = [
    ...ADMIN_MAIN_NAV,
    { label: "Content", href: "/admin/content/site", icon: Settings2 },
  ];

  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
      {pills.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href.replace("/site", ""));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active ? "bg-primary text-white" : "bg-slate-100 text-slate-600"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
