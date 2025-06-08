"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, User, Settings, LogOut, Shield, HelpCircle } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  isRead: boolean
  type: "info" | "warning" | "success" | "error"
}

export function Header() {
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      title: "نوبت جدید",
      message: "نوبت جدیدی برای دکتر احمدی ثبت شد",
      time: "۵ دقیقه پیش",
      isRead: false,
      type: "info",
    },
    {
      id: "2",
      title: "تخصیص خدمت",
      message: "خدمت تزریقات به فاطمه احمدی تخصیص یافت",
      time: "۱۰ دقیقه پیش",
      isRead: false,
      type: "success",
    },
    {
      id: "3",
      title: "هشدار سیستم",
      message: "ظرفیت نوبت‌های امروز تکمیل شد",
      time: "۳۰ دقیقه پیش",
      isRead: true,
      type: "warning",
    },
    {
      id: "4",
      title: "کاربر جدید",
      message: "کاربر جدیدی در سیستم ثبت‌نام کرد",
      time: "۱ ساعت پیش",
      isRead: true,
      type: "info",
    },
  ])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅"
      case "warning":
        return "⚠️"
      case "error":
        return "❌"
      default:
        return "ℹ️"
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm h-[73px] flex items-center">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="flex items-center justify-between">
          <div></div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80" dir="rtl">
                <DropdownMenuLabel className="text-right">اعلان‌ها</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex flex-col items-start p-3 cursor-pointer ${
                        !notification.isRead ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 text-right">
                          <div className="font-medium text-sm">{notification.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{notification.message}</div>
                          <div className="text-xs text-muted-foreground mt-1">{notification.time}</div>
                        </div>
                        {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-sm text-blue-600 cursor-pointer">
                  مشاهده همه اعلان‌ها
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="پروفایل" />
                    <AvatarFallback className="bg-orange-100 text-orange-700">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" dir="rtl">
                <DropdownMenuLabel className="text-right">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">مدیر سیستم</p>
                    <p className="text-xs leading-none text-muted-foreground">admin@banoban.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-right">
                  <User className="ml-2 h-4 w-4" />
                  <span>پروفایل</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-right">
                  <Settings className="ml-2 h-4 w-4" />
                  <span>تنظیمات</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-right">
                  <Shield className="ml-2 h-4 w-4" />
                  <span>امنیت</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-right">
                  <HelpCircle className="ml-2 h-4 w-4" />
                  <span>راهنما</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 text-right">
                  <LogOut className="ml-2 h-4 w-4" />
                  <span>خروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
