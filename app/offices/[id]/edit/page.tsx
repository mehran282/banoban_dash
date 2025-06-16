"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Building, MapPin, Phone, Mail, Calendar, Save, X, ArrowLeft, Upload, Camera
} from "lucide-react"

// اضافه کردن فونت Vazirmatn از CDN
const loadFont = () => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.href = 'https://cdn.jsdelivr.net/npm/vazirmatn@33.003.0/Vazirmatn-Variable-font-face.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
}

// Utility function برای تبدیل اعداد انگلیسی به فارسی
const toPersianNumber = (num: number | string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)])
}

interface Office {
  id: string
  title: string
  type: 'doctor' | 'consultant' | 'expert'
  owner: string
  phone: string
  email: string
  address: string
  city: string
  province: string
  postalCode: string
  licenseNumber: string
  establishedYear: string
  description: string
  status: 'active' | 'pending' | 'suspended'
  registrationDate: string
  logo?: string
}

// Mock data
const mockOffice: Office = {
  id: "1",
  title: "مطب دکتر احمدی",
  type: "doctor",
  owner: "دکتر علی احمدی",
  phone: "۰۲۱-۲۲۳۴۵۶۷۸",
  email: "dr.ahmadi@example.com",
  address: "تهران، خیابان ولیعصر، پلاک ۱۲۳",
  city: "تهران",
  province: "تهران",
  postalCode: "۱۹۱۱۱۱۱۱۱۱",
  licenseNumber: "۱۲۳۴۵",
  establishedYear: "۱۴۰۰",
  description: "مطب تخصصی قلب و عروق با بیش از ۱۰ سال تجربه",
  status: "active",
  registrationDate: "۱۴۰۳/۰۳/۱۵"
}

const provinces = [
  "تهران", "اصفهان", "خراسان رضوی", "فارس", "خوزستان", "مازندران", "گیلان", "آذربایجان شرقی",
  "کرمان", "مرکزی", "گلستان", "قزوین", "قم", "لرستان", "البرز", "بوشهر", "هرمزگان",
  "کردستان", "همدان", "یزد", "اردبیل", "چهارمحال و بختیاری", "ایلام", "کرمانشاه", 
  "کهگیلویه و بویراحمد", "سمنان", "زنجان", "آذربایجان غربی", "خراسان شمالی", "خراسان جنوبی", "سیستان و بلوچستان"
]

export default function OfficeEdit() {
  const params = useParams()
  const router = useRouter()
  const [office, setOffice] = useState<Office>(mockOffice)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadFont()
  }, [])

  const getTypeName = (type: string) => {
    switch (type) {
      case 'doctor': return 'پزشک'
      case 'consultant': return 'مشاور'
      case 'expert': return 'کارشناس'
      default: return 'نامشخص'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">فعال</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">در انتظار تایید</Badge>
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">تعلیق شده</Badge>
      default:
        return <Badge variant="secondary">نامشخص</Badge>
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // اینجا API call برای ذخیره تغییرات انجام می‌شود
      await new Promise(resolve => setTimeout(resolve, 1000)) // شبیه‌سازی API call
      
      // نمایش پیام موفقیت یا redirect
      router.push(`/offices/${office.id}`)
    } catch (error) {
      console.error('خطا در ذخیره تغییرات:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push(`/offices/${office.id}`)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl" style={{ fontFamily: 'Vazirmatn, sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.push(`/offices/${office.id}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          بازگشت به پروفایل
        </Button>
        <div className="text-right">
          <h1 className="text-3xl font-bold text-gray-900">ویرایش دفتر</h1>
          <p className="text-gray-600 mt-2">{office.title}</p>
        </div>
      </div>

      {/* Office Header Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-20 w-20 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="h-10 w-10 text-blue-600" />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold">{office.title}</h2>
                <p className="text-gray-600">{getTypeName(office.type)}</p>
                <p className="text-sm text-gray-500">مالک: {office.owner}</p>
              </div>
            </div>
            {getStatusBadge(office.status)}
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* اطلاعات کلی */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right">اطلاعات کلی</CardTitle>
            <CardDescription className="text-right">
              اطلاعات اصلی دفتر را ویرایش کنید
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-right">نام دفتر</Label>
              <Input
                value={office.title}
                onChange={(e) => setOffice(prev => ({ ...prev, title: e.target.value }))}
                className="text-right"
                dir="rtl"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-right">نوع دفتر</Label>
              <Select value={office.type} onValueChange={(value: 'doctor' | 'consultant' | 'expert') => setOffice(prev => ({ ...prev, type: value }))}>
                <SelectTrigger dir="rtl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">پزشک</SelectItem>
                  <SelectItem value="consultant">مشاور</SelectItem>
                  <SelectItem value="expert">کارشناس</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-right">نام مالک</Label>
              <Input
                value={office.owner}
                onChange={(e) => setOffice(prev => ({ ...prev, owner: e.target.value }))}
                className="text-right"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right">شماره پروانه</Label>
              <Input
                value={office.licenseNumber}
                onChange={(e) => setOffice(prev => ({ ...prev, licenseNumber: e.target.value }))}
                className="text-right"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right">سال تاسیس</Label>
              <Input
                value={office.establishedYear}
                onChange={(e) => setOffice(prev => ({ ...prev, establishedYear: e.target.value }))}
                className="text-right"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right">توضیحات</Label>
              <Textarea
                value={office.description}
                onChange={(e) => setOffice(prev => ({ ...prev, description: e.target.value }))}
                className="text-right min-h-[100px]"
                dir="rtl"
              />
            </div>
          </CardContent>
        </Card>

        {/* اطلاعات تماس */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right">اطلاعات تماس</CardTitle>
            <CardDescription className="text-right">
              اطلاعات تماس و آدرس دفتر را ویرایش کنید
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-right">شماره تلفن</Label>
              <Input
                value={office.phone}
                onChange={(e) => setOffice(prev => ({ ...prev, phone: e.target.value }))}
                className="text-right"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right">ایمیل</Label>
              <Input
                type="email"
                value={office.email}
                onChange={(e) => setOffice(prev => ({ ...prev, email: e.target.value }))}
                className="text-right"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right">استان</Label>
              <Select
                value={office.province}
                onValueChange={(value) => setOffice(prev => ({ ...prev, province: value }))}
              >
                <SelectTrigger dir="rtl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map(province => (
                    <SelectItem key={province} value={province}>{province}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-right">شهر</Label>
              <Input
                value={office.city}
                onChange={(e) => setOffice(prev => ({ ...prev, city: e.target.value }))}
                className="text-right"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right">آدرس کامل</Label>
              <Textarea
                value={office.address}
                onChange={(e) => setOffice(prev => ({ ...prev, address: e.target.value }))}
                className="text-right min-h-[100px]"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right">کد پستی</Label>
              <Input
                value={office.postalCode}
                onChange={(e) => setOffice(prev => ({ ...prev, postalCode: e.target.value }))}
                className="text-right"
                dir="rtl"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              <X className="h-4 w-4 ml-2" />
              انصراف
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="h-4 w-4 ml-2" />
              {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 