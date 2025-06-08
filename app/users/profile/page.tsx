"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


export default function UserProfilePage() {
  return (
    <div className="space-y-6">
      <div className="max-w-6xl mx-auto p-6 space-y-6 font-vazir" dir="rtl">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">مدیریت پروفایل کاربران</CardTitle>
              <CardDescription className="text-right">مشاهده و ویرایش پروفایل کاربران سیستم</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>صفحه مدیریت پروفایل در حال توسعه است...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
