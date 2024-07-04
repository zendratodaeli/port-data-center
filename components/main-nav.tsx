"use client"

import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation"

export const MainNav = ({
  className, ...props
} : React.HTMLAttributes<HTMLElement>) => {

  const pathname = usePathname();
  const { user } = useUser();
  const userId = user?.id;
  const listAdminId = ["user_2il1XkfhJFtxhMslrBq1JK6PapV"]; // Assuming listAdminId is an array

  const routes = [
    {
      href: `/data`,
      label: 'Data',
      active: pathname === `/data`
    },
  ];

  if (userId && listAdminId.includes(userId)) {
    routes.unshift({
      href: `/dashboard`,
      label: 'Dashboard',
      active: pathname === `/dashboard`
    });
  }

  return (
    <nav
      className={cn("hidden md:flex mx-4 items-center space-x-4 lg:space-x-6", className)}
    > 
      <div>
        <Link href={"/"}>
          <h1 className="text-2xl text-muted-foreground hover:text-primary font-bold border-r-2 pr-4 lg:pr-6">Port Data-Center</h1>
        </Link>
      </div>
      {routes.map(route => (
        <Link 
          key={route.href}
          href={route.href}
          className={cn("text-sm font-medium transition-colors hover:text-primary", route.active ? "text-black dark:text-white" : "text-muted-foreground")}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}