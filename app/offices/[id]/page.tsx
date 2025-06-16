"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { 
  Building, MapPin, Phone, Mail, Calendar, Clock, Users, FileText, 
  Edit, Save, X, Plus, Download, Eye, Trash2, Upload, 
  Stethoscope, Scale, MessageCircle, ArrowLeft, Camera, 
  IdCard, GraduationCap, Award, Briefcase
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

interface Document {
  id: string
  name: string
  type: 'id_card' | 'birth_certificate' | 'diploma' | 'license' | 'other'
  url: string
  uploadDate: string
  size: number
}

interface ScheduleSlot {
  id: string
  day: string
  startTime: string
  endTime: string
  isActive: boolean
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
  status: 'active' | 'pending' | 'suspended'
  logo?: string
  registrationDate: string
  description: string
  documents: Document[]
  schedule: ScheduleSlot[]
  usersCount: number
  licenseNumber: string
  establishedYear: string
}

// Mock data
const mockOffice: Office = {
  id: "1",
  title: "مطب دکتر احمدی",
  type: "doctor",
  owner: "دکتر علی احمدی",
  phone: "۰۲۱-۲۲۳۴۵۶۷۸",
  email: "dr.ahmadi@email.com",
  address: "تهران، خیابان ولیعصر، پلاک ۱۲۳، طبقه دوم، واحد ۵",
  city: "تهران",
  province: "تهران",
  postalCode: "۱۲۳۴۵۶۷۸۹۰",
  status: "active",
  registrationDate: "۱۴۰۳/۰۳/۱۵",
  description: "مطب تخصصی قلب و عروق با بیش از ۱۵ سال سابقه فعالیت. ارائه خدمات تشخیصی و درمانی با بهره‌گیری از جدیدترین تجهیزات پزشکی.",
  licenseNumber: "۱۲۳۴۵۶۷۸",
  establishedYear: "۱۳۸۸",
  usersCount: 3,
  documents: [
    {
      id: "1",
      name: "کارت ملی دکتر احمدی",
      type: "id_card", 
      url: "/mock/id-card.jpg",
      uploadDate: "۱۴۰۳/۰۳/۱۵",
      size: 2.5
    },
    {
      id: "2",
      name: "شناسنامه",
      type: "birth_certificate",
      url: "/mock/birth-cert.jpg", 
      uploadDate: "۱۴۰۳/۰۳/۱۵",
      size: 1.8
    },
    {
      id: "3",
      name: "مدرک دکترای پزشکی",
      type: "diploma",
      url: "/mock/diploma.pdf",
      uploadDate: "۱۴۰۳/۰۳/۱۵", 
      size: 5.2
    },
    {
      id: "4",
      name: "پروانه فعالیت نظام پزشکی",
      type: "license",
      url: "/mock/license.pdf",
      uploadDate: "۱۴۰۳/۰۳/۱۵",
      size: 3.1
    },
    {
      id: "5",
      name: "گواهی تخصص قلب و عروق",
      type: "other",
      url: "/mock/specialty.pdf",
      uploadDate: "۱۴۰۳/۰۳/۱۵",
      size: 2.8
    }
  ],
  schedule: [
    { id: "1", day: "شنبه", startTime: "۰۸:۰۰", endTime: "۱۲:۰۰", isActive: true },
    { id: "2", day: "یکشنبه", startTime: "۰۸:۰۰", endTime: "۱۲:۰۰", isActive: true },
    { id: "3", day: "دوشنبه", startTime: "۱۶:۰۰", endTime: "۲۰:۰۰", isActive: true },
    { id: "4", day: "سه‌شنبه", startTime: "۰۸:۰۰", endTime: "۱۲:۰۰", isActive: true },
    { id: "5", day: "چهارشنبه", startTime: "۱۶:۰۰", endTime: "۲۰:۰۰", isActive: true },
    { id: "6", day: "پنج‌شنبه", startTime: "۰۸:۰۰", endTime: "۱۲:۰۰", isActive: false },
    { id: "7", day: "جمعه", startTime: "", endTime: "", isActive: false }
  ]
}

const provinces = [
  "تهران", "اصفهان", "خراسان رضوی", "فارس", "خوزستان", "مازندران", "گیلان", "آذربایجان شرقی",
  "کرمان", "مرکزی", "گلستان", "قزوین", "قم", "لرستان", "البرز", "بوشهر", "هرمزگان",
  "کردستان", "همدان", "یزد", "اردبیل", "چهارمحال و بختیاری", "ایلام", "کرمانشاه", 
  "کهگیلویه و بویراحمد", "سمنان", "زنجان", "آذربایجان غربی", "خراسان شمالی", "خراسان جنوبی", "سیستان و بلوچستان"
]

export default function OfficeProfile() {
  const params = useParams()
  const router = useRouter()
  const [office, setOffice] = useState<Office>(mockOffice)
  const [isEditing, setIsEditing] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
    loadFont()
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'doctor': return <Stethoscope className="h-5 w-5" />
      case 'consultant': return <MessageCircle className="h-5 w-5" />
      case 'expert': return <Scale className="h-5 w-5" />
      default: return <Building className="h-5 w-5" />
    }
  }

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

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'id_card': return <IdCard className="h-5 w-5 text-blue-600" />
      case 'birth_certificate': return <FileText className="h-5 w-5 text-green-600" />
      case 'diploma': return <GraduationCap className="h-5 w-5 text-purple-600" />
      case 'license': return <Award className="h-5 w-5 text-orange-600" />
      default: return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case 'id_card': return 'کارت ملی'
      case 'birth_certificate': return 'شناسنامه'
      case 'diploma': return 'مدرک تحصیلی'
      case 'license': return 'پروانه فعالیت'
      default: return 'سایر'
    }
  }

  const handleSaveBasicInfo = () => {
    // اینجا باید اطلاعات را به سرور ارسال کنید
    setEditingSection(null)
    console.log('Basic info saved:', office)
  }

  const handleSaveSchedule = () => {
    // اینجا باید برنامه زمان‌بندی را به سرور ارسال کنید
    setEditingSection(null)
    console.log('Schedule saved:', office.schedule)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    // اینجا باید فایل‌ها را به سرور آپلود کنید
    files.forEach(file => {
      const newDocument: Document = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: 'other',
        url: URL.createObjectURL(file),
        uploadDate: new Date().toLocaleDateString('fa-IR'),
        size: file.size / (1024 * 1024)
      }
      setOffice(prev => ({
        ...prev,
        documents: [...prev.documents, newDocument]
      }))
    })
    setUploadDialogOpen(false)
  }

  const handleDeleteDocument = (documentId: string) => {
    setOffice(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== documentId)
    }))
    setDeleteDialogOpen(null)
  }

  if (!mounted) {
    return (
      <div className="container mx-auto p-6 space-y-6" dir="rtl" style={{ fontFamily: 'Vazirmatn, sans-serif' }}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl" style={{ fontFamily: 'Vazirmatn, sans-serif' }} suppressHydrationWarning={true}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.push('/offices/list')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          بازگشت به لیست
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/offices/${office.id}/edit`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            ویرایش کامل
          </Button>
        </div>
      </div>

      {/* Office Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={office.logo} />
              <AvatarFallback className="bg-blue-100 text-2xl">
                {getTypeIcon(office.type)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="text-right">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{office.title}</h1>
                  <p className="text-lg text-gray-600 mb-3">{office.owner}</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(office.type)}
                      <span className="text-sm font-medium">{getTypeName(office.type)}</span>
                    </div>
                    {getStatusBadge(office.status)}
                  </div>
                  <p className="text-gray-600 leading-relaxed max-w-2xl">{office.description}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="basic" className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            اطلاعات اولیه
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            مدارک
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            زمان‌بندی
          </TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between" dir="rtl">
              <div className="text-right">
                <CardTitle>اطلاعات پایه</CardTitle>
                <CardDescription>اطلاعات اساسی دفتر</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingSection(editingSection === 'basic' ? null : 'basic')}
              >
                {editingSection === 'basic' ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                {editingSection === 'basic' ? 'لغو' : 'ویرایش'}
              </Button>
            </CardHeader>
            <CardContent>
              {editingSection === 'basic' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Label className="text-right">نام مالک</Label>
                    <Input
                      value={office.owner}
                      onChange={(e) => setOffice(prev => ({ ...prev, owner: e.target.value }))}
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-right">شماره تماس</Label>
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
                      <SelectTrigger dir="rtl" className="text-right">
                        <SelectValue className="text-right" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        {provinces.map(province => (
                          <SelectItem key={province} value={province} className="text-right">{province}</SelectItem>
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
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-right">آدرس کامل</Label>
                    <Textarea
                      value={office.address}
                      onChange={(e) => setOffice(prev => ({ ...prev, address: e.target.value }))}
                      className="text-right"
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
                  <div className="space-y-2">
                    <Label className="text-right">شماره پروانه</Label>
                    <Input
                      value={office.licenseNumber}
                      onChange={(e) => setOffice(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-right">توضیحات</Label>
                    <Textarea
                      value={office.description}
                      onChange={(e) => setOffice(prev => ({ ...prev, description: e.target.value }))}
                      className="text-right"
                      dir="rtl"
                      rows={4}
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-start gap-2" dir="rtl">
                    <Button onClick={handleSaveBasicInfo}>
                      <Save className="h-4 w-4 mr-1" />
                      ذخیره
                    </Button>
                    <Button variant="outline" onClick={() => setEditingSection(null)}>
                      لغو
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">نام دفتر</p>
                    <p className="font-medium">{office.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">نام مالک</p>
                    <p className="font-medium">{office.owner}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">شماره تماس</p>
                    <p className="font-medium">{office.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">ایمیل</p>
                    <p className="font-medium">{office.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">استان</p>
                    <p className="font-medium">{office.province}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">شهر</p>
                    <p className="font-medium">{office.city}</p>
                  </div>
                  <div className="md:col-span-2 text-right">
                    <p className="text-sm text-gray-600">آدرس کامل</p>
                    <p className="font-medium">{office.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">کد پستی</p>
                    <p className="font-medium">{office.postalCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">شماره پروانه</p>
                    <p className="font-medium">{office.licenseNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">سال تاسیس</p>
                    <p className="font-medium">{office.establishedYear}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">تاریخ ثبت</p>
                    <p className="font-medium">{office.registrationDate}</p>
                  </div>
                  <div className="md:col-span-2 text-right">
                    <p className="text-sm text-gray-600">توضیحات</p>
                    <p className="font-medium leading-relaxed">{office.description}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between" dir="rtl">
              <div className="text-right">
                <CardTitle>مدارک و اسناد</CardTitle>
                <CardDescription>مدارک بارگذاری شده برای این دفتر</CardDescription>
              </div>
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    افزودن مدرک
                  </Button>
                </DialogTrigger>
                <DialogContent dir="rtl">
                  <DialogHeader>
                    <DialogTitle>بارگذاری مدرک جدید</DialogTitle>
                    <DialogDescription>
                      مدرک جدید را انتخاب کنید
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                      variant="outline"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      انتخاب فایل
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" dir="rtl">
                {office.documents.map((document) => (
                  <Card key={document.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getDocumentIcon(document.type)}
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                          {getDocumentTypeName(document.type)}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <AlertDialog
                          open={deleteDialogOpen === document.id}
                          onOpenChange={(open) => setDeleteDialogOpen(open ? document.id : null)}
                        >
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <AlertDialogContent dir="rtl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>حذف مدرک</AlertDialogTitle>
                              <AlertDialogDescription>
                                آیا مطمئن هستید که می‌خواهید این مدرک را حذف کنید؟ این عمل قابل بازگشت نیست.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>لغو</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteDocument(document.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className="text-right">
                      <h4 className="font-medium text-sm mb-2">{document.name}</h4>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">
                          تاریخ بارگذاری: {document.uploadDate}
                        </p>
                        <p className="text-xs text-gray-500">
                          حجم: {toPersianNumber(document.size.toFixed(1))} مگابایت
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {office.documents.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">مدرکی بارگذاری نشده</h3>
                  <p className="text-gray-600 mb-6">برای شروع، اولین مدرک را بارگذاری کنید.</p>
                  <Button onClick={() => setUploadDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    بارگذاری مدرک
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between" dir="rtl">
              <div className="text-right">
                <CardTitle>برنامه زمان‌بندی</CardTitle>
                <CardDescription>ساعات کاری هفتگی دفتر</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingSection(editingSection === 'schedule' ? null : 'schedule')}
              >
                {editingSection === 'schedule' ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                {editingSection === 'schedule' ? 'لغو' : 'ویرایش'}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" dir="rtl">
                {office.schedule.map((slot) => (
                                      <div key={slot.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4 text-right">
                      {editingSection === 'schedule' ? (
                        <>
                          <input
                            type="checkbox"
                            checked={slot.isActive}
                            onChange={(e) => {
                              setOffice(prev => ({
                                ...prev,
                                schedule: prev.schedule.map(s => 
                                  s.id === slot.id ? { ...s, isActive: e.target.checked } : s
                                )
                              }))
                            }}
                            className="rounded"
                          />
                          <span className="font-medium w-20">{slot.day}</span>
                          {slot.isActive && (
                            <div className="flex items-center gap-2">
                              <Input
                                type="time"
                                value={slot.startTime.replace(/[۰-۹]/g, (d) => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)])}
                                onChange={(e) => {
                                  const persianTime = e.target.value.replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)])
                                  setOffice(prev => ({
                                    ...prev,
                                    schedule: prev.schedule.map(s => 
                                      s.id === slot.id ? { ...s, startTime: persianTime } : s
                                    )
                                  }))
                                }}
                                className="w-24"
                              />
                              <span>تا</span>
                              <Input
                                type="time"
                                value={slot.endTime.replace(/[۰-۹]/g, (d) => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)])}
                                onChange={(e) => {
                                  const persianTime = e.target.value.replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)])
                                  setOffice(prev => ({
                                    ...prev,
                                    schedule: prev.schedule.map(s => 
                                      s.id === slot.id ? { ...s, endTime: persianTime } : s
                                    )
                                  }))
                                }}
                                className="w-24"
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className={`w-3 h-3 rounded-full ${slot.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="font-medium w-20">{slot.day}</span>
                          <span className="text-gray-600">
                            {slot.isActive && slot.startTime && slot.endTime 
                              ? `${slot.startTime} - ${slot.endTime}`
                              : 'تعطیل'
                            }
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                
                {editingSection === 'schedule' && (
                  <div className="flex justify-start gap-2 pt-4" dir="rtl">
                    <Button onClick={handleSaveSchedule}>
                      <Save className="h-4 w-4 mr-1" />
                      ذخیره
                    </Button>
                    <Button variant="outline" onClick={() => setEditingSection(null)}>
                      لغو
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 