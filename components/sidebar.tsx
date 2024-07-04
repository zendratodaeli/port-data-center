"use client"

import { Montserrat } from "next/font/google"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Database, HomeIcon, LayoutDashboard } from "lucide-react"
import { usePathname } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Separator } from "./ui/separator"

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"]
})

const SideBar = () => {
  const pathname = usePathname();
  const { user } = useUser();
    const userId = user?.id;
    const listAdminId = ["user_2il1XkfhJFtxhMslrBq1JK6PapV"]; // Assuming listAdminId is an array
  
  const routes = [
    {
      label: "Data",
      icon: Database,
      href: "/data",
      color: "text-black"
    },
  ]

  if (userId && listAdminId.includes(userId)) {
    routes.unshift({
      href: `/dashboard`,
      label: 'Dashboard',
      icon: Database,
      color: "text-black"
    });
  }

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-50 text-black">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center mb-5">
          <h1 className={cn("text-2xl text-muted-foreground hover:text-black font-bold", montserrat.className)}>Port Data Center</h1>
        </Link>
        <Separator/>
        <div className=" mt-2 space-y-1">
          {routes.map(route => (
            <Link 
              href={route.href}
              key={route.href}
              className={cn("text-normal p-5 group flex w-full justify-start font-medium cursor-pointer hover:text-black hover:font-bold hover:bg-slate-200 hover:rounded-md transition", 
              pathname === route.href ? "text-black bg-slate-300 rounded-md" : "text-zinc-700" )}  
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>  
  )
}

export default SideBar
