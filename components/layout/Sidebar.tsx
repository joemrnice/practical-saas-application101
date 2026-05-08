"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/generate", label: "Generate" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-r border-zinc-200 bg-white p-4 md:w-60">
      <Link href="/dashboard" className="mb-6 block text-lg font-semibold">
        AI SaaS
      </Link>
      <nav className="grid gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm hover:bg-zinc-100",
              pathname === link.href && "bg-zinc-900 text-white hover:bg-zinc-900"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
