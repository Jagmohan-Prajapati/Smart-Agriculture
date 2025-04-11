"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, FileText, Home, LayoutDashboard, LogOut, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Crop Predictions",
    href: "/dashboard/predictions",
    icon: BarChart2,
  },
  {
    title: "Contracts",
    href: "/dashboard/contracts",
    icon: FileText,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: Home,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-16 flex-col justify-between border-r bg-background p-3 md:w-64">
      <div className="space-y-4">
        <div className="flex h-16 items-center justify-center md:justify-start">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <span className="hidden text-green-600 md:inline-block">Smart</span>
            <span className="hidden md:inline-block">Agriculture</span>
            <span className="text-green-600 md:hidden">S</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-2">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                size="sm"
                className={cn("w-full justify-start", pathname === item.href && "bg-muted font-medium")}
              >
                <item.icon className="h-5 w-5 md:mr-2" />
                <span className="hidden md:inline-block">{item.title}</span>
              </Button>
            </Link>
          ))}
        </nav>
      </div>
      <Button variant="ghost" size="sm" className="w-full justify-start">
        <LogOut className="h-5 w-5 md:mr-2" />
        <span className="hidden md:inline-block">Logout</span>
      </Button>
    </div>
  )
}

