"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Upload, MapPin, Users, FileText, Building, Stethoscope, Scale, MessageCircle, Search, Plus, X } from "lucide-react"

// Utility function برای تبدیل اعداد انگلیسی به فارسی
const toPersianNumber = (num: number | string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)])
}

// Utility function برای تبدیل اعداد فارسی به انگلیسی
const toEnglishNumber = (persianStr: string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  
  let result = persianStr
  persianDigits.forEach((persianDigit, index) => {
    result = result.replace(new RegExp(persianDigit, 'g'), englishDigits[index])
  })
  return result
}

interface OfficeData {
  type: string
  title: string
  address: string
  postalCode: string
  phone: string
  cityCode: string
  province: string
  city: string
  location: { lat: number; lng: number } | null
  logo: File | null
  licenses: File[]
  users: Array<{ id: string; nationalId: string; name: string; role: string }>
}

const provinces = [
  "تهران", "اصفهان", "خراسان رضوی", "فارس", "خوزستان", "مازندران", "گیلان", "آذربایجان شرقی",
  "کرمان", "مرکزی", "گلستان", "قزوین", "قم", "لرستان", "البرز", "بوشهر", "هرمزگان",
  "کردستان", "همدان", "یزد", "اردبیل", "چهارمحال و بختیاری", "ایلام", "کرمانشاه", 
  "کهگیلویه و بویراحمد", "سمنان", "زنجان", "آذربایجان غربی", "خراسان شمالی", "خراسان جنوبی", "سیستان و بلوچستان"
]

export default function OfficeRegistrationWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [officeData, setOfficeData] = useState<OfficeData>({
    type: "",
    title: "",
    address: "",
    postalCode: "",
    phone: "",
    cityCode: "",
    province: "",
    city: "",
    location: null,
    logo: null,
    licenses: [],
    users: []
  })
  const [searchNationalId, setSearchNationalId] = useState("")
  const [mapClicked, setMapClicked] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setOfficeData(prev => ({
      ...prev,
      licenses: [...prev.licenses, ...files]
    }))
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setOfficeData(prev => ({
        ...prev,
        logo: file
      }))
    }
  }

  const removeFile = (index: number) => {
    setOfficeData(prev => ({
      ...prev,
      licenses: prev.licenses.filter((_, i) => i !== index)
    }))
  }

  const removeLogo = () => {
    setOfficeData(prev => ({
      ...prev,
      logo: null
    }))
  }

  // تابع برای ایجاد URL پیش‌نمایش عکس
  const createImagePreview = (file: File): string => {
    return URL.createObjectURL(file)
  }

  // تابع برای بررسی نوع فایل عکس
  const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/')
  }

  const searchUser = () => {
    // تبدیل کد ملی فارسی به انگلیسی برای مقایسه
    const englishNationalId = toEnglishNumber(searchNationalId)
    
    if (englishNationalId === "1234567890") {
      const mockUser = {
        id: Date.now().toString(),
        nationalId: searchNationalId, // نگه داری نسخه فارسی
        name: "احمد محمدی",
        role: officeData.type === "doctor" ? "پزشک" : officeData.type === "consultant" ? "مشاور" : "کارشناس"
      }
      setOfficeData(prev => ({
        ...prev,
        users: [...prev.users, mockUser]
      }))
      setSearchNationalId("")
    }
  }

  const removeUser = (id: string) => {
    setOfficeData(prev => ({
      ...prev,
      users: prev.users.filter(user => user.id !== id)
    }))
  }

  const handleMapClick = () => {
    // Mock location - در پروژه واقعی نقشه واقعی استفاده می‌شود
    setOfficeData(prev => ({
      ...prev,
      location: { lat: 35.6892, lng: 51.3890 }
    }))
    setMapClicked(true)
  }

  const resetForm = () => {
    setCurrentStep(1)
    setOfficeData({
      type: "",
      title: "",
      address: "",
      postalCode: "",
      phone: "",
      cityCode: "",
      province: "",
      city: "",
      location: null,
      logo: null,
      licenses: [],
      users: []
    })
    setSearchNationalId("")
    setMapClicked(false)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return officeData.type !== ""
      case 2:
        return officeData.title && officeData.address && officeData.postalCode && 
               officeData.phone && officeData.province && officeData.city
      case 3:
        return officeData.licenses.length > 0
      case 4:
        return true // اختیاری
      default:
        return true
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 font-vazir" dir="rtl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ثبت نام دفتر جدید</h1>
        <p className="text-gray-600">فرم ثبت نام دفاتر پزشکی، حقوقی و مشاوره</p>
      </div>

      {/* Progress Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6" dir="rtl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">مرحله {toPersianNumber(currentStep)} از {toPersianNumber(totalSteps)}</span>
            <span className="text-sm text-gray-500">٪{toPersianNumber(Math.round(progress))} تکمیل شده</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${progress}%`
              }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-blue-600' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {toPersianNumber(1)}
              </div>
              <span className="mt-1">نوع دفتر</span>
            </div>
            <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-blue-600' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {toPersianNumber(2)}
              </div>
              <span className="mt-1">اطلاعات</span>
            </div>
            <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-blue-600' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {toPersianNumber(3)}
              </div>
              <span className="mt-1">مجوزها</span>
            </div>
            <div className={`flex flex-col items-center ${currentStep >= 4 ? 'text-blue-600' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {toPersianNumber(4)}
              </div>
              <span className="mt-1">کاربران</span>
            </div>
            <div className={`flex flex-col items-center ${currentStep >= 5 ? 'text-blue-600' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 5 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {toPersianNumber(5)}
              </div>
              <span className="mt-1">تایید</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="mb-6">
        <CardContent className="pt-6" dir="rtl">
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">نوع دفتر را انتخاب کنید</h2>
                <p className="text-gray-600">لطفاً نوع دفتری که می‌خواهید ثبت کنید را انتخاب نمایید</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div 
                  className={`border-2 rounded-xl p-8 cursor-pointer transition-all hover:shadow-lg ${
                    officeData.type === 'doctor' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setOfficeData(prev => ({ ...prev, type: 'doctor' }))}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="h-8 w-8 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">پزشک</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">برای ثبت مطب پزشکی</p>
                  </div>
                </div>
                
                <div 
                  className={`border-2 rounded-xl p-8 cursor-pointer transition-all hover:shadow-lg ${
                    officeData.type === 'consultant' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setOfficeData(prev => ({ ...prev, type: 'consultant' }))}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-8 w-8 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">مشاور</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">برای ثبت دفتر مشاوره</p>
                  </div>
                </div>
                
                <div 
                  className={`border-2 rounded-xl p-8 cursor-pointer transition-all hover:shadow-lg ${
                    officeData.type === 'expert' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setOfficeData(prev => ({ ...prev, type: 'expert' }))}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <Scale className="h-8 w-8 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">کارشناس</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">برای ثبت دفتر کارشناسی</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <CardHeader className="px-0">
                <CardTitle className="flex items-center gap-2 text-right">
                  <FileText className="h-5 w-5" />
                  اطلاعات دفتر
                </CardTitle>
                <CardDescription className="text-right">
                  اطلاعات مربوط به دفتر خود را وارد کنید
                </CardDescription>
              </CardHeader>

              {/* Logo Upload Section */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={() => logoInputRef.current?.click()}>
                    {officeData.logo ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={createImagePreview(officeData.logo)} 
                          alt="Logo"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeLogo()
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">بارگذاری لوگو</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-right">عنوان دفتر</Label>
                  <Input
                    id="title"
                    value={officeData.title}
                    onChange={(e) => setOfficeData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="نام دفتر خود را وارد کنید"
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-right">شماره تماس</Label>
                  <Input
                    id="phone"
                    value={officeData.phone}
                    onChange={(e) => setOfficeData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="شماره تماس"
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province" className="text-right">استان</Label>
                  <Select value={officeData.province} onValueChange={(value) => setOfficeData(prev => ({ ...prev, province: value }))}>
                    <SelectTrigger className="text-right" dir="rtl">
                      <SelectValue placeholder="استان را انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province} value={province}>{province}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-right">شهر</Label>
                  <Input
                    id="city"
                    value={officeData.city}
                    onChange={(e) => setOfficeData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="نام شهر"
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-right">آدرس کامل</Label>
                  <Textarea
                    id="address"
                    value={officeData.address}
                    onChange={(e) => setOfficeData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="آدرس کامل دفتر"
                    className="text-right min-h-[100px]"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-right">کد پستی</Label>
                  <Input
                    id="postalCode"
                    value={officeData.postalCode}
                    onChange={(e) => setOfficeData(prev => ({ ...prev, postalCode: e.target.value }))}
                    placeholder="کد پستی ۱۰ رقمی"
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cityCode" className="text-right">کد شهر</Label>
                  <Input
                    id="cityCode"
                    value={officeData.cityCode}
                    onChange={(e) => setOfficeData(prev => ({ ...prev, cityCode: e.target.value }))}
                    placeholder="کد شهر"
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-right">موقعیت جغرافیایی</Label>
                  <div 
                    className="border border-gray-300 rounded-md p-8 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={handleMapClick}
                  >
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      {mapClicked ? (
                        <div>
                          <p className="text-green-600 font-medium">موقعیت انتخاب شده</p>
                          <p className="text-sm text-gray-600 mt-1">
                            عرض جغرافیایی: {toPersianNumber(officeData.location?.lat.toFixed(6) || "")}
                          </p>
                          <p className="text-sm text-gray-600">
                            طول جغرافیایی: {toPersianNumber(officeData.location?.lng.toFixed(6) || "")}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-600 font-medium">انتخاب موقعیت روی نقشه</p>
                          <p className="text-sm text-gray-500 mt-1">برای انتخاب موقعیت کلیک کنید</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <CardHeader className="px-0">
                <CardTitle className="flex items-center gap-2 text-right">
                  <FileText className="h-5 w-5" />
                  بارگذاری مجوزها
                </CardTitle>
                <CardDescription className="text-right">
                  فایل‌های مجوزهای لازم را بارگذاری کنید
                </CardDescription>
              </CardHeader>

              <div className="space-y-6" dir="rtl">
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">فایل‌های مجوز را انتخاب کنید</p>
                  <p className="text-sm text-gray-600">یا فایل‌ها را به اینجا بکشید</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </div>

                {officeData.licenses.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-right">فایل‌های بارگذاری شده</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {officeData.licenses.map((file, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 relative">
                          {/* Thumbnail or Icon */}
                          <div className="mb-3">
                            {isImageFile(file) ? (
                              <img 
                                src={createImagePreview(file)} 
                                alt={file.name}
                                className="w-full h-32 object-cover rounded"
                              />
                            ) : (
                              <div className="w-full h-32 bg-blue-100 rounded flex items-center justify-center">
                                <FileText className="h-8 w-8 text-blue-600" />
                              </div>
                            )}
                          </div>
                          
                          {/* File Info */}
                          <div className="text-right">
                            <p className="text-sm font-medium truncate" title={file.name}>
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {toPersianNumber((file.size / 1024 / 1024).toFixed(2))} مگابایت
                            </p>
                          </div>
                          
                          {/* Delete Button */}
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <CardHeader className="px-0">
                <CardTitle className="flex items-center gap-2 text-right">
                  <Users className="h-5 w-5" />
                  افزودن کاربران
                </CardTitle>
                <CardDescription className="text-right">
                  کاربران موجود را به دفتر اضافه کنید (اختیاری)
                </CardDescription>
              </CardHeader>

              <div className="space-y-6" dir="rtl">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="nationalId" className="text-right">کد ملی کاربر</Label>
                    <Input
                      id="nationalId"
                      value={searchNationalId}
                      onChange={(e) => setSearchNationalId(e.target.value)}
                      placeholder="کد ملی را وارد کنید (تست: ۱۲۳۴۵۶۷۸۹۰)"
                      className="text-right mt-2"
                      dir="rtl"
                    />
                  </div>
                  <Button onClick={searchUser} className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    جستجو
                  </Button>
                </div>

                {officeData.users.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-right">کاربران اضافه شده</h3>
                    <div className="space-y-3">
                      {officeData.users.map((user) => (
                        <div key={user.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-3 flex-1 justify-end">
                            <div className="text-right">
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500">کد ملی: {user.nationalId}</p>
                            </div>
                            <Badge variant="secondary">{user.role}</Badge>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUser(user.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <CardHeader className="px-0">
                <CardTitle className="flex items-center gap-2 text-right">
                  <CheckCircle className="h-5 w-5" />
                  تایید نهایی
                </CardTitle>
                <CardDescription className="text-right">
                  اطلاعات وارد شده را بررسی و تایید کنید
                </CardDescription>
              </CardHeader>

              <div className="space-y-6" dir="rtl">
                <div className="grid gap-6">
                  {/* Logo Display */}
                  {officeData.logo && (
                    <div className="flex justify-center">
                      <Card className="w-fit">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <img 
                              src={createImagePreview(officeData.logo)} 
                              alt="Logo"
                              className="w-24 h-24 object-cover rounded-lg mx-auto mb-2"
                            />
                            <p className="text-sm text-gray-600">لوگو دفتر</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-right">اطلاعات کلی</CardTitle>
                    </CardHeader>
                    <CardContent className="text-right">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">نوع دفتر</p>
                          <p className="font-medium">
                                            {officeData.type === 'doctor' ? 'پزشک' :
                officeData.type === 'consultant' ? 'مشاور' : 'کارشناس'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">عنوان</p>
                          <p className="font-medium">{officeData.title}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">تلفن</p>
                          <p className="font-medium">{officeData.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">استان</p>
                          <p className="font-medium">{officeData.province}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">شهر</p>
                          <p className="font-medium">{officeData.city}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">کد پستی</p>
                          <p className="font-medium">{officeData.postalCode}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600">آدرس</p>
                          <p className="font-medium">{officeData.address}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-right">مجوزها</CardTitle>
                    </CardHeader>
                    <CardContent className="text-right">
                      <p className="text-sm text-gray-600 mb-4">
                        {toPersianNumber(officeData.licenses.length)} فایل بارگذاری شده
                      </p>
                      {officeData.licenses.length > 0 && (
                        <div className="grid grid-cols-2 gap-3">
                          {officeData.licenses.map((file, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-3">
                              {/* Thumbnail or Icon */}
                              <div className="mb-2">
                                {isImageFile(file) ? (
                                  <img 
                                    src={createImagePreview(file)} 
                                    alt={file.name}
                                    className="w-full h-16 object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-full h-16 bg-blue-100 rounded flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                  </div>
                                )}
                              </div>
                              
                              {/* File Info */}
                              <div className="text-right">
                                <p className="text-xs font-medium truncate" title={file.name}>
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {toPersianNumber((file.size / 1024 / 1024).toFixed(2))} مگابایت
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-right">کاربران</CardTitle>
                    </CardHeader>
                    <CardContent className="text-right">
                      {officeData.users.length > 0 ? (
                        <div className="space-y-3">
                          {officeData.users.map((user) => (
                            <div key={user.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center gap-3 flex-1 justify-end">
                                <div className="text-right">
                                  <p className="text-sm font-medium">{user.name}</p>
                                  <p className="text-xs text-gray-500">کد ملی: {user.nationalId}</p>
                                </div>
                                <Badge variant="secondary">{user.role}</Badge>
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Users className="h-4 w-4 text-blue-600" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">کاربری اضافه نشده است</p>
                      )}
                    </CardContent>
                  </Card>

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-right">
                      با تایید نهایی، درخواست ثبت نام دفتر شما ارسال خواهد شد و پس از بررسی، نتیجه از طریق پیامک اطلاع‌رسانی خواهد شد.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          قبلی
        </Button>

        <div className="flex gap-2">
          {currentStep === totalSteps ? (
            <>
              <Button variant="outline" onClick={resetForm}>
                شروع مجدد
              </Button>
              <Button 
                onClick={() => {
                  alert('درخواست ثبت نام با موفقیت ارسال شد!')
                  resetForm()
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                تایید نهایی
              </Button>
            </>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2"
            >
              بعدی
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}