"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@matchfaca/ui";

function FlameIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.6}
      className="size-6"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function SwordsIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.6}
      className="size-6"
    >
      <path d="M14.5 17.5L3 6l2-2 11.5 11.5" />
      <path d="M9.5 17.5L21 6l-2-2L7.5 15.5" />
      <path d="M6.5 12.5L3 16l2 2 3.5-3.5" />
      <path d="M17.5 12.5L21 16l-2 2-3.5-3.5" />
      <path d="M12 20l-1-4" />
    </svg>
  );
}

function PersonIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.6}
      className="size-6"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
    </svg>
  );
}

const navItems = [
  { href: "/swipe", label: "Deslizar", Icon: FlameIcon },
  { href: "/matches", label: "Lutas", Icon: SwordsIcon },
  { href: "/profile", label: "Perfil", Icon: PersonIcon },
] as const;

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-around px-4 py-2">
        {navItems.map(({ href, label, Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-1 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon active={isActive} />
              <span>{label}</span>
              {isActive && (
                <span className="mt-0.5 h-0.5 w-5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
