"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  Settings,
  Users,
  UserCheck,
  Home,
  ChevronDown,
  ChevronRight,
  Calendar,
  Stethoscope,
  Pill,
  CalendarCheck,
  LogOut,
  User,
  GraduationCap,
  Building,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

interface SubMenuItem {
  title: string
  href: string
  icon: React.ReactNode
  description: string
}

interface MenuItem {
  title: string
  href?: string
  icon: React.ReactNode
  description: string
  subItems?: SubMenuItem[]
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const pathname = usePathname()

  const menuItems: MenuItem[] = [
    {
      title: "داشبورد",
      href: "/",
      icon: <Home className="h-5 w-5" />,
      description: "صفحه اصلی سیستم",
    },
    {
      title: "خدمات",
      icon: <Stethoscope className="h-5 w-5" />,
      description: "مدیریت خدمات پزشکی",
      subItems: [
        {
          title: "مدیریت خدمات",
          href: "/services",
          icon: <Settings className="h-4 w-4" />,
          description: "افزودن و مدیریت خدمات",
        },
        {
          title: "تخصیص خدمات",
          href: "/assignments",
          icon: <UserCheck className="h-4 w-4" />,
          description: "تخصیص خدمات به کادر درمان",
        },
        {
          title: "مدیریت تخصص‌ها",
          href: "/specialties",
          icon: <GraduationCap className="h-4 w-4" />,
          description: "مدیریت تخصص‌های پزشکی",
        },
      ],
    },
    {
      title: "کاربران",
      icon: <Users className="h-5 w-5" />,
      description: "مدیریت کاربران و کادر درمان",
      subItems: [
        {
          title: "برنامه کاری",
          href: "/users/schedule",
          icon: <Calendar className="h-4 w-4" />,
          description: "مدیریت برنامه کاری کادر درمان",
        },
        {
          title: "پروفایل",
          href: "/users/profile",
          icon: <User className="h-4 w-4" />,
          description: "مدیریت پروفایل کاربران",
        },
        {
          title: "ثبت نام",
          href: "/users/register",
          icon: <UserCheck className="h-4 w-4" />,
          description: "ثبت نام کاربران جدید",
        },
      ],
    },
    {
      title: "داروها",
      href: "/medicines",
      icon: <Pill className="h-5 w-5" />,
      description: "مدیریت داروها و قیمت‌ها",
    },
    {
      title: "نوبت‌دهی",
      href: "/appointments",
      icon: <Calendar className="h-5 w-5" />,
      description: "مدیریت نوبت‌ها و ویزیت آنلاین",
    },
    {
      title: "رزروها",
      href: "/reservations",
      icon: <CalendarCheck className="h-5 w-5" />,
      description: "مدیریت رزروها و پیگیری",
    },
    {
      title: "مدیریت دفاتر",
      icon: <Building className="h-5 w-5" />,
      description: "مدیریت دفاتر و مراکز درمانی",
      subItems: [
        {
          title: "ثبت نام دفتر",
          href: "/offices/register",
          icon: <Settings className="h-4 w-4" />,
          description: "ثبت نام دفتر جدید",
        },
        {
          title: "لیست دفاتر",
          href: "/offices/list",
          icon: <Building className="h-4 w-4" />,
          description: "مشاهده و مدیریت دفاتر ثبت شده",
        },
      ],
    },
  ]

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  const toggleMenu = (menuTitle: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuTitle) ? prev.filter((item) => item !== menuTitle) : [...prev, menuTitle],
    )
  }

  const isMenuExpanded = (menuTitle: string) => expandedMenus.includes(menuTitle)

  const isSubItemActive = (subItems: SubMenuItem[] | undefined) => {
    return subItems?.some((subItem) => pathname === subItem.href) || false
  }

  const handleLogout = () => {
    if (confirm("آیا از خروج از سیستم اطمینان دارید؟")) {
      // شبیه‌سازی خروج
      alert("با موفقیت از سیستم خارج شدید")
      // در اینجا می‌توانید کاربر را به صفحه ورود هدایت کنید
      // window.location.href = '/login'
    }
  }

  const renderMenuItem = (item: MenuItem, isMobile = false) => {
    const hasSubItems = item.subItems && item.subItems.length > 0
    const hasActiveSubItem = isSubItemActive(item.subItems)
    const isExpanded = isMenuExpanded(item.title) || hasActiveSubItem
    const isActive = !hasSubItems && pathname === item.href // فقط برای آیتم‌هایی که ساب منو ندارند

    if (hasSubItems) {
      return (
        <div key={item.title}>
          <div
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
              hasActiveSubItem
                ? "bg-orange-50 text-orange-700 border border-orange-200"
                : "hover:bg-gray-50 text-gray-700"
            }`}
            onClick={() => toggleMenu(item.title)}
          >
            <div className={`${hasActiveSubItem ? "text-orange-600" : "text-gray-500"}`}>{item.icon}</div>
            <div className="flex-1 text-right">
              <div className={`font-medium ${hasActiveSubItem ? "text-orange-700" : "text-gray-900"}`}>
                {item.title}
              </div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
            <div className={`${hasActiveSubItem ? "text-orange-600" : "text-gray-500"}`}>
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          </div>

          {isExpanded && (
            <div className="mr-6 mt-2 space-y-1">
              {item.subItems?.map((subItem) => {
                const isSubActive = pathname === subItem.href
                return (
                  <Link key={subItem.href} href={subItem.href} onClick={isMobile ? handleLinkClick : undefined}>
                    <div
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${
                        isSubActive
                          ? "bg-orange-50 text-orange-700 border border-orange-200"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className={`${isSubActive ? "text-orange-600" : "text-gray-500"}`}>{subItem.icon}</div>
                      <div className="flex-1 text-right">
                        <div className={`text-sm font-medium ${isSubActive ? "text-orange-700" : "text-gray-900"}`}>
                          {subItem.title}
                        </div>
                        <div className="text-xs text-gray-500">{subItem.description}</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link key={item.href} href={item.href!} onClick={isMobile ? handleLinkClick : undefined}>
        <div
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
            isActive ? "bg-orange-50 text-orange-700 border border-orange-200" : "hover:bg-gray-50 text-gray-700"
          }`}
        >
          <div className={`${isActive ? "text-orange-600" : "text-gray-500"}`}>{item.icon}</div>
          <div className="flex-1 text-right">
            <div className={`font-medium ${isActive ? "text-orange-700" : "text-gray-900"}`}>{item.title}</div>
            <div className="text-xs text-gray-500">{item.description}</div>
          </div>
        </div>
      </Link>
    )
  }

  // اضافه کردن useEffect برای باز کردن خودکار منوهای دارای ساب منو فعال
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.subItems && item.subItems.some((subItem) => pathname === subItem.href)) {
        if (!expandedMenus.includes(item.title)) {
          setExpandedMenus((prev) => [...prev, item.title])
        }
      }
    })
  }, [pathname, menuItems, expandedMenus])

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 right-4 z-50">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0" dir="rtl">
            <SheetHeader className="p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <div className="text-right">
                  <SheetTitle className="text-lg font-bold text-gray-900">بانوبان</SheetTitle>
                  <p className="text-sm text-gray-500">پنل مدیریت نوبت‌دهی و ویزیت آنلاین</p>
                </div>
              </div>
            </SheetHeader>

            <nav className="p-4 flex-1">
              <div className="space-y-2">{menuItems.map((item) => renderMenuItem(item, true))}</div>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                خروج از سیستم
              </Button>
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="text-center text-xs text-gray-500">
                <p>سیستم نوبت‌دهی و ویزیت آنلاین</p>
                <p className="mt-1">نسخه ۱.۰.۰</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div
        className="hidden md:flex flex-col flex-shrink-0 w-80 h-screen bg-white border-l border-gray-200 shadow-sm z-40"
        dir="rtl"
      >
        <div className="h-[73px] px-6 border-b flex items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div className="text-right">
              <h1 className="text-lg font-bold text-gray-900">بانوبان</h1>
              <p className="text-sm text-gray-500">پنل مدیریت نوبت‌دهی و ویزیت آنلاین</p>
            </div>
          </div>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-2">{menuItems.map((item) => renderMenuItem(item))}</div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t bg-white mt-auto">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            خروج از سیستم
          </Button>
        </div>

        <div className="p-4 border-t bg-gray-50">
          <div className="text-center text-xs text-gray-500">
            <p>سیستم نوبت‌دهی و ویزیت آنلاین</p>
            <p className="mt-1">نسخه ۱.۰.۰</p>
          </div>
        </div>
      </div>
    </>
  )
}
