"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, PieChart, TrendingUp, Activity, Users } from "lucide-react"
import { toPersianDigits } from "../utils/persian-utils"

export function ChartsSection() {
  // داده‌های نمونه برای نمودارها
  const appointmentData = [
    { day: "شنبه", count: 12 },
    { day: "یکشنبه", count: 18 },
    { day: "دوشنبه", count: 15 },
    { day: "سه‌شنبه", count: 22 },
    { day: "چهارشنبه", count: 19 },
    { day: "پنج‌شنبه", count: 8 },
    { day: "جمعه", count: 5 },
  ]

  const serviceDistribution = [
    { name: "تزریقات", value: 35, color: "bg-blue-500" },
    { name: "سرم‌تراپی", value: 25, color: "bg-green-500" },
    { name: "پانسمان", value: 20, color: "bg-yellow-500" },
    { name: "سونداژ", value: 12, color: "bg-purple-500" },
    { name: "سایر", value: 8, color: "bg-gray-500" },
  ]

  const monthlyRevenue = [
    { month: "فروردین", amount: 15000000 },
    { month: "اردیبهشت", amount: 18000000 },
    { month: "خرداد", amount: 22000000 },
    { month: "تیر", amount: 19000000 },
    { month: "مرداد", amount: 25000000 },
    { month: "شهریور", amount: 28000000 },
  ]

  const doctorPerformance = [
    { name: "دکتر احمد محمدی", appointments: 45, revenue: 12000000 },
    { name: "دکتر مریم حسینی", appointments: 38, revenue: 9500000 },
    { name: "دکتر حسن موسوی", appointments: 52, revenue: 15000000 },
    { name: "فاطمه احمدی", appointments: 28, revenue: 6000000 },
  ]

  const maxAppointments = Math.max(...appointmentData.map((d) => d.count))
  const maxRevenue = Math.max(...monthlyRevenue.map((d) => d.amount))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">نمودارها و آمار</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* نمودار نوبت‌های هفتگی */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              نوبت‌های هفتگی
            </CardTitle>
            <CardDescription className="text-right">تعداد نوبت‌های ثبت شده در هفته جاری</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointmentData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm font-medium w-16 text-right">{item.day}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(item.count / maxAppointments) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-blue-600 w-8 text-left">
                    {toPersianDigits(item.count.toString())}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* نمودار توزیع خدمات */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <PieChart className="h-5 w-5 text-green-600" />
              توزیع خدمات
            </CardTitle>
            <CardDescription className="text-right">درصد استفاده از خدمات مختلف</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {serviceDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-4 h-4 rounded ${item.color}`}></div>
                    <span className="text-sm font-medium">{item.name}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${item.color}`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-600">{toPersianDigits(item.value.toString())}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* نمودار درآمد ماهانه */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              درآمد ماهانه
            </CardTitle>
            <CardDescription className="text-right">درآمد حاصل از خدمات در ۶ ماه گذشته</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyRevenue.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm font-medium w-20 text-right">{item.month}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(item.amount / maxRevenue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-purple-600 text-left">
                    {toPersianDigits((item.amount / 1000000).toString())}M
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* عملکرد کادر درمان */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              عملکرد کادر درمان
            </CardTitle>
            <CardDescription className="text-right">تعداد نوبت‌ها و درآمد هر عضو کادر درمان</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {doctorPerformance.map((doctor, index) => (
                <div key={index} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-sm">{doctor.name}</h4>
                    <div className="flex gap-4 text-xs text-gray-600">
                      <span>نوبت: {toPersianDigits(doctor.appointments.toString())}</span>
                      <span>درآمد: {toPersianDigits((doctor.revenue / 1000000).toString())}M</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">تعداد نوبت</div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(doctor.appointments / 60) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">درآمد</div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(doctor.revenue / 20000000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* خلاصه آمار */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">خلاصه آمار</CardTitle>
          <CardDescription className="text-right">آمار کلی سیستم در یک نگاه</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {toPersianDigits(appointmentData.reduce((sum, item) => sum + item.count, 0).toString())}
              </div>
              <div className="text-sm text-gray-600">کل نوبت‌های هفته</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {toPersianDigits((monthlyRevenue[monthlyRevenue.length - 1].amount / 1000000).toFixed(1).toString())}M
              </div>
              <div className="text-sm text-gray-600">درآمد ماه جاری</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {toPersianDigits(
                  (
                    ((monthlyRevenue[monthlyRevenue.length - 1].amount -
                      monthlyRevenue[monthlyRevenue.length - 2].amount) /
                      monthlyRevenue[monthlyRevenue.length - 2].amount) *
                    100
                  )
                    .toFixed(1)
                    .toString(),
                )}
                %
              </div>
              <div className="text-sm text-gray-600">رشد ماهانه</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {toPersianDigits(
                  (appointmentData.reduce((sum, item) => sum + item.count, 0) / appointmentData.length)
                    .toFixed(1)
                    .toString(),
                )}
              </div>
              <div className="text-sm text-gray-600">میانگین نوبت روزانه</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
