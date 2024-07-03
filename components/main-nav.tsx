"use client"

import { cn } from "@/lib/utils"
import Link from "next/link";
import { useParams, usePathname } from "next/navigation"

export const MainNav = ({
  className, ...props
} : React.HTMLAttributes<HTMLElement>) => {

  const pathname = usePathname();

  const routes = [
    {
      href: `/dashboard`,
      label: 'Dashboard',
      active: pathname === `/dashboard`
    },
    {
      href: `/data`,
      label: 'Data',
      active: pathname === `/data`
    },
  ]
  return (
    <nav
      className={cn(" hidden md:flex mx-4 items-center space-x-4 lg:space-x-6", className)}
    > 
      <div>
        <h1 className=" text-2xl text-muted-foreground hover:text-primary font-bold border-r-2 pr-4 lg:pr-6">Port Data-Center</h1>
      </div>
      {routes.map(route => (
        <Link 
          key={route.href}
          href={route.href}
          className={cn(" text-sm font-medium transition-colors hover:text-primary", route.active ? " text-black dark:text-white" : " text-muted-foreground")}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
