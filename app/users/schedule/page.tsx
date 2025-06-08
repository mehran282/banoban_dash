"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "../../../components/header"

export default function UserSchedulePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="md:mr-80">
        <div className="max-w-6xl mx-auto p-6 space-y-6 font-vazir" dir="rtl">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">برنامه کاری کادر درمان</CardTitle>
              <CardDescription className="text-right">مدیریت برنامه کاری و شیفت‌های کادر درمان</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>صفحه برنامه کاری در حال توسعه است...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
