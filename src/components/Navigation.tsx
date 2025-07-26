"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  Settings,
  UserCheck,
  Warehouse,
  BookOpen,
  User,
  LogOut,
  Info,
} from "lucide-react"

interface NavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  userRole: string
}

export const Navigation = ({ activeTab, setActiveTab, userRole }: NavigationProps) => {
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Admin", "Sales", "Accountant"] },
    { id: "stock", label: "Central Stock", icon: Warehouse, roles: ["Admin", "Sales"] },
    { id: "inventory", label: "Shop Inventory", icon: Package, roles: ["Admin", "Sales"] },
    { id: "sales", label: "Sales", icon: ShoppingCart, roles: ["Admin", "Sales"] },
    { id: "customers", label: "Customers", icon: UserCheck, roles: ["Admin", "Sales"] },
    { id: "receipts", label: "Receipts", icon: BookOpen, roles: ["Admin", "Sales"] },
    { id: "financial", label: "Financial", icon: DollarSign, roles: ["Admin", "Accountant"] },
    { id: "users", label: "Users", icon: Users, roles: ["Admin"] },
  ]

  const filteredItems = navigationItems.filter((item) => item.roles.includes(userRole))

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RT</span>
              </div>
              <span className="font-semibold text-gray-900 hidden sm:block">RetailTrack</span>
            </div>

            <div className="hidden md:flex space-x-1">
              {filteredItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    onClick={() => setActiveTab(item.id)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="hidden sm:flex">
              Store: Main Branch
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => (window.location.href = "/about")}>
                  <Info className="h-4 w-4 mr-2" />
                  About
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => (window.location.href = "/configuration")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configuration
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => (window.location.href = "/profile")}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => (window.location.href = "/user-manual")}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  User Manual
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => alert("Sign out functionality")}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-1 overflow-x-auto">
            {filteredItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(item.id)}
                  className="flex items-center space-x-2 whitespace-nowrap"
                  size="sm"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
