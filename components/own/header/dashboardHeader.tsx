"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const MenuList = [
  { name: "Dashboard", link: "/dashboard" },
  { name: "Services", link: "/services" },
  { name: "Expenses", link: "/expenses" },
  { name: "Items", link: "/item" },
  { name: "Jurnal Umum", link: "/jurnalumum" },
  { name: "Jurnal Penyesuaian", link: "/jurnalpenyesuaian" },
  { name: "Akun Akuntansi", link: "/accounts" },
  { name: "Worksheet", link: "/worksheet" },
  { name: "Report", link: "/report" },
];

const DashboardHeaderOwnComponent = () => {
  const pathname = usePathname();
  return (
    <header className="flex items-center justify-between mb-6 mx-auto px-4 md:px-6 py-8">
      <nav className="gap-4 sm:text-xs text-sm font-medium hidden md:flex">
        {MenuList.map((data, index) => (
          <Link
            href={data.link}
            className={` dark:text-gray-400 dark:hover:text-gray-50 ${
              pathname === data.link
                ? "font-bold text-gray-900"
                : "text-gray-500 hover:text-gray-900"
            }`}
            prefetch={false}
            key={index}
          >
            {data.name}
          </Link>
        ))}
        <span onClick={() => signOut()} className=" cursor-pointer">
          Sign Out
        </span>
      </nav>
      <div className=" md:hidden">
        <Sheet>
          <SheetTrigger>
            <h1>Open</h1>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription></SheetDescription>
            <div className="grid gap-4 py-4">
              {MenuList.map((data, index) => (
                <Link
                  href={data.link}
                  className={` dark:text-gray-400 dark:hover:text-gray-50 ${
                    pathname === data.link
                      ? "font-bold text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  prefetch={false}
                  key={index}
                >
                  {data.name}
                </Link>
              ))}
              <Button onClick={() => signOut()}>Sign Out</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default DashboardHeaderOwnComponent;
