"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText, Newspaper, Layers, Mail, Users, LayoutDashboard, FolderKanban,
  Wrench, Lightbulb, UserSquare2, Briefcase, FileUser, Images,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/blog/posts", label: "Blog Posts", icon: Newspaper },
  { href: "/admin/blog/categories", label: "Blog Categories", icon: Layers },
  { href: "/admin/portfolio", label: "Portfolio", icon: FolderKanban },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/solutions", label: "Solutions", icon: Lightbulb },
  { href: "/admin/team", label: "Team", icon: UserSquare2 },
  { href: "/admin/careers/positions", label: "Job Positions", icon: Briefcase },
  { href: "/admin/careers/applications", label: "Applications", icon: FileUser },
  { href: "/admin/contact", label: "Contact Messages", icon: Mail },
  { href: "/admin/newsletter", label: "Newsletter", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900 lg:block">
      <div className="px-5 py-6">
        <span className="font-display text-lg font-semibold text-ink-950 dark:text-white">Syntrix Admin</span>
      </div>
      <nav className="space-y-1 px-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-gold-600/10 text-gold-700 dark:text-gold-400"
                  : "text-ink-600 hover:bg-pale-100 dark:text-ink-300 dark:hover:bg-ink-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
