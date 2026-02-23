"use client";

import Link from "next/link";
import { ListTodo, Clock, CheckCircle2, Briefcase, User, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import React from "react";

// ── Moved outside Navbar to avoid "component created during render" error ──
interface SidebarContentProps {
  pathname: string;
  navLinkClass: (path: string) => string;
}

function SidebarContent({ navLinkClass }: SidebarContentProps): React.ReactElement {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <Image src="/logo.png" alt="TodoIt Logo" className="rounded-full" width={30} height={30} />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">TodoIt</h1>
          <p className="text-xs text-gray-500">Productivity App</p>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-2">
        <p className="text-xs font-semibold text-gray-500 tracking-wider mb-3 px-2">FILTERS</p>
        <nav className="space-y-1">
          <Link href="/components/allTask" className={navLinkClass("/components/allTask")}>
            <ListTodo size={18} />
            <span className="font-medium text-sm">All Tasks</span>
          </Link>
          <Link href="/components/pendingTask" className={navLinkClass("/components/pendingTask")}>
            <Clock size={18} />
            <span className="font-medium text-sm">Pending</span>
          </Link>
          <Link href="/components/completedTask" className={navLinkClass("/components/completedTask")}>
            <CheckCircle2 size={18} />
            <span className="font-medium text-sm">Completed</span>
          </Link>
        </nav>
      </div>

      {/* Categories */}
      <div className="px-4 py-6">
        <p className="text-xs font-semibold text-gray-500 tracking-wider mb-3 px-2">CATEGORIES</p>
        <nav className="space-y-1">
          <Link href="/categories/work" className={navLinkClass("/categories/work")}>
            <Briefcase size={18} />
            <span className="font-medium text-sm">Work</span>
          </Link>
          <Link href="/categories/personal" className={navLinkClass("/categories/personal")}>
            <User size={18} />
            <span className="font-medium text-sm">Personal</span>
          </Link>
          <Link href="/categories/health" className={navLinkClass("/categories/health")}>
            <Heart size={18} />
            <span className="font-medium text-sm">Health</span>
          </Link>
          <Link href="/categories/shopping" className={navLinkClass("/categories/shopping")}>
            <ShoppingCart size={18} />
            <span className="font-medium text-sm">Shopping</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default function Navbar(): React.ReactElement {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const prevPathname = useRef<string>(pathname);

  // Close drawer when route changes — pakai ref agar tidak trigger setState-in-effect warning
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(false);
    }
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinkClass = (path: string): string => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === path || (path === "/components/allTask" && pathname === "/") ? "bg-[#17233B] text-blue-500 hover:bg-[#1A2845]" : "text-gray-400 hover:text-gray-200 hover:bg-[#1A1C23]"}`;

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="w-65 shrink-0 bg-[#0F1115] border-r border-[#1B1E25] flex-col justify-between hidden md:flex h-full">
        <SidebarContent pathname={pathname} navLinkClass={navLinkClass} />
      </aside>

      {/* ── Mobile: Hamburger Button ── */}
      <button onClick={() => setIsOpen(true)} className="md:hidden fixed top-6 left-6 z-50 p-2.5 rounded-xl bg-[#0F1115]/80 backdrop-blur-md border border-[#1B1E25] text-gray-400 hover:text-gray-200 transition-all shadow-lg" aria-label="Open menu">
        <Menu size={20} />
      </button>

      {/* ── Mobile: Overlay ── */}
      {isOpen && <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />}

      {/* ── Mobile: Slide-in Drawer (left → right) ── */}
      <div className={`md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-[#0F1115] border-r border-[#1B1E25] transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Close button */}
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-[#1A1C23] transition-colors" aria-label="Close menu">
          <X size={18} />
        </button>

        <SidebarContent pathname={pathname} navLinkClass={navLinkClass} />
      </div>
    </>
  );
}
