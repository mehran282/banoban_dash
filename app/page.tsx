"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "../components/header"
import { Users, UserCheck, Calendar, Stethoscope, Pill, CalendarCheck } from "lucide-react"
import Link from "next/link"
import { ChartsSection } from "../components/charts-section"

export default function Home() {
  const stats = [
    {
      title: "کل خدمات",
      value: "۱۲",
      description: "خدمات پزشکی فعال",
      icon: <Stethoscope className="h-8 w-8 text-blue-600" />,
      href: "/services",
    },
    {
      title: "کادر درمان",
      value: "۸",
      description: "کادر درمان فعال",
      icon: <Users className="h-8 w-8 text-green-600" />,
      href: "/users",
    },
    {
      title: "تخصیص‌ها",
      value: "۲۴",
      description: "تخصیص خدمات به کادر درمان",
      icon: <UserCheck className="h-8 w-8 text-purple-600" />,
      href: "/assignments",
    },
    {
      title: "داروها",
      value: "۱۵۶",
      description: "داروهای ثبت شده",
      icon: <Pill className="h-8 w-8 text-pink-600" />,
      href: "/medicines",
    },
    {
      title: "نوبت‌ها",
      value: "۱۵۶",
      description: "نوبت‌های امروز",
      icon: <Calendar className="h-8 w-8 text-orange-600" />,
      href: "/appointments",
    },
    {
      title: "رزروها",
      value: "۴۲",
      description: "رزروهای فعال",
      icon: <CalendarCheck className="h-8 w-8 text-indigo-600" />,
      href: "/reservations",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="md:mr-80">
        <div className="max-w-6xl mx-auto p-6 space-y-6 font-vazir" dir="rtl">
          {/* Welcome Section */}
          <div className="text-center py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">خوش آمدید به سیستم بانوبان</h1>
            <p className="text-gray-600">پنل مدیریت نوبت‌دهی و ویزیت آنلاین</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {stats.map((stat, index) => (
              <Link key={index} href={stat.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-right">{stat.title}</CardTitle>
                    {stat.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-right">{stat.value}</div>
                    <p className="text-xs text-muted-foreground text-right">{stat.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Charts Section */}
          <ChartsSection />
        </div>
      </div>
    </div>
  )
}
