"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Trash2, Edit, Eye, EyeOff, Users, Stethoscope, Heart, User, 
  Brain, Ear, Baby, Activity, Shield, Apple, MessageCircle,
  Scale, UserCheck, GraduationCap, Smile, Zap, BookOpen,
  Home, Book, Sparkles, Pill, Waves, Target, Dumbbell,
  Flower2, UserX, Droplets, Bug, HelpCircle, Hospital,
  Contact, CloudRain, HeartHandshake
} from "lucide-react"
import { toPersianDigits } from "./utils/persian-utils"
import { Header } from "./components/header"

interface Specialty {
  id: string
  title: string
  description: string
  category: 'doctor' | 'consultant' | 'expert'
  userCount: number
  isActive: boolean
}

// تابع تشخیص ایکن بر اساس عنوان تخصص
const getSpecialtyIcon = (title: string) => {
  switch (title) {
    case 'پوست و مو': return <Contact className="h-4 w-4" />
    case 'قلب و عروق': return <Heart className="h-4 w-4" />
    case 'داخلی': return <Stethoscope className="h-4 w-4" />
    case 'رادیولوژی': return <Target className="h-4 w-4" />
    case 'ارتوپد': return <Dumbbell className="h-4 w-4" />
    case 'مغز و اعصاب': return <Brain className="h-4 w-4" />
    case 'گوش و حلق و بینی': return <Ear className="h-4 w-4" />
    case 'طب سنتی': return <Flower2 className="h-4 w-4" />
    case 'زنان': return <User className="h-4 w-4" />
    case 'عمومی': return <Stethoscope className="h-4 w-4" />
    case 'پرستاری': return <UserCheck className="h-4 w-4" />
    case 'تغذیه': return <Apple className="h-4 w-4" />
    case 'سلامت جنسی': return <Shield className="h-4 w-4" />
    case 'اطفال': return <Baby className="h-4 w-4" />
    case 'غدد': return <Activity className="h-4 w-4" />
    case 'کلیه و مجاری ادراری': return <Droplets className="h-4 w-4" />
    case 'عفونی': return <Bug className="h-4 w-4" />
    case 'خون و سرطان': return <Activity className="h-4 w-4" />
    case 'فیزیوتراپی': return <Waves className="h-4 w-4" />
    case 'توانبخشی': return <UserCheck className="h-4 w-4" />
    case 'روانپزشک': return <Brain className="h-4 w-4" />
    case 'روانشناس': return <MessageCircle className="h-4 w-4" />
    case 'طب اسلامی': return <Book className="h-4 w-4" />
    
    // مشاوره
    case 'ازدواج و طلاق': return <HeartHandshake className="h-4 w-4" />
    case 'اضطراب و افسردگی': return <CloudRain className="h-4 w-4" />
    case 'مشاوره جنسی': return <Shield className="h-4 w-4" />
    case 'فرزندپروری': return <Baby className="h-4 w-4" />
    case 'تحصیلی': return <GraduationCap className="h-4 w-4" />
    case 'نوجوانی و بلوغ': return <Smile className="h-4 w-4" />
    case 'ترک اعتیاد': return <UserX className="h-4 w-4" />
    
    // کارشناسی
    case 'وکیل': return <Scale className="h-4 w-4" />
    
    default: return <HelpCircle className="h-4 w-4" />
  }
}

// تابع تشخیص رنگ دسته‌بندی
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'doctor': return 'bg-blue-100 text-blue-800'
    case 'consultant': return 'bg-green-100 text-green-800'
    case 'expert': return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// تابع تشخیص نام دسته‌بندی
const getCategoryName = (category: string) => {
  switch (category) {
    case 'doctor': return 'پزشک'
    case 'consultant': return 'مشاور'
    case 'expert': return 'کارشناس'
    default: return 'نامشخص'
  }
}

export default function SpecialtiesForm() {
  const [specialties, setSpecialties] = useState<Specialty[]>([
    // تخصص‌های پزشکی
    { id: "1", title: "پوست و مو", description: "تشخیص و درمان بیماری‌های پوست و مو", category: "doctor", userCount: 2, isActive: true },
    { id: "2", title: "قلب و عروق", description: "تشخیص و درمان بیماری‌های قلب و عروق", category: "doctor", userCount: 3, isActive: true },
    { id: "3", title: "داخلی", description: "پزشک متخصص داخلی", category: "doctor", userCount: 5, isActive: true },
    { id: "4", title: "رادیولوژی", description: "تصویربرداری پزشکی و تشخیص", category: "doctor", userCount: 1, isActive: true },
    { id: "5", title: "ارتوپد", description: "جراحی استخوان و مفاصل", category: "doctor", userCount: 2, isActive: true },
    { id: "6", title: "مغز و اعصاب", description: "تشخیص و درمان اختلالات مغز و اعصاب", category: "doctor", userCount: 1, isActive: true },
    { id: "7", title: "گوش و حلق و بینی", description: "متخصص گوش و حلق و بینی", category: "doctor", userCount: 1, isActive: true },
    { id: "8", title: "طب سنتی", description: "درمان با روش‌های طب سنتی", category: "doctor", userCount: 2, isActive: true },
    { id: "9", title: "زنان", description: "بهداشت و درمان زنان", category: "doctor", userCount: 3, isActive: true },
    { id: "10", title: "عمومی", description: "پزشک عمومی و درمان اولیه", category: "doctor", userCount: 8, isActive: true },
    { id: "11", title: "پرستاری", description: "خدمات پرستاری و مراقبت", category: "doctor", userCount: 12, isActive: true },
    { id: "12", title: "تغذیه", description: "مشاوره تغذیه و رژیم درمانی", category: "doctor", userCount: 4, isActive: true },
    { id: "13", title: "سلامت جنسی", description: "مشاوره و درمان مسائل جنسی", category: "doctor", userCount: 1, isActive: true },
    { id: "14", title: "اطفال", description: "پزشک متخصص کودکان", category: "doctor", userCount: 4, isActive: true },
    { id: "15", title: "غدد", description: "تشخیص و درمان اختلالات غدد", category: "doctor", userCount: 1, isActive: true },
    { id: "16", title: "کلیه و مجاری ادراری", description: "متخصص کلیه و مجاری ادراری", category: "doctor", userCount: 2, isActive: true },
    { id: "17", title: "عفونی", description: "تشخیص و درمان بیماری‌های عفونی", category: "doctor", userCount: 1, isActive: true },
    { id: "18", title: "خون و سرطان", description: "انکولوژی و هماتولوژی", category: "doctor", userCount: 1, isActive: true },
    { id: "19", title: "فیزیوتراپی", description: "درمان فیزیکی و توانبخشی حرکتی", category: "doctor", userCount: 6, isActive: true },
    { id: "20", title: "توانبخشی", description: "توانبخشی و بازتوانی", category: "doctor", userCount: 3, isActive: true },
    { id: "21", title: "روانپزشک", description: "تشخیص و درمان اختلالات روانی", category: "doctor", userCount: 2, isActive: true },
    { id: "22", title: "روانشناس", description: "مشاوره و درمان روانشناختی", category: "doctor", userCount: 5, isActive: true },
    { id: "23", title: "طب اسلامی", description: "طب بر اساس منابع اسلامی", category: "doctor", userCount: 1, isActive: true },
    
    // تخصص‌های مشاوره
    { id: "24", title: "ازدواج و طلاق", description: "مشاوره ازدواج، خانواده و طلاق", category: "consultant", userCount: 3, isActive: true },
    { id: "25", title: "اضطراب و افسردگی", description: "مشاوره اختلالات خلقی و اضطراب", category: "consultant", userCount: 4, isActive: true },
    { id: "26", title: "مشاوره جنسی", description: "مشاوره روابط جنسی و زناشویی", category: "consultant", userCount: 2, isActive: true },
    { id: "27", title: "فرزندپروری", description: "مشاوره تربیت فرزند و والدینی", category: "consultant", userCount: 3, isActive: true },
    { id: "28", title: "تحصیلی", description: "مشاوره تحصیلی و انتخاب رشته", category: "consultant", userCount: 2, isActive: true },
    { id: "29", title: "نوجوانی و بلوغ", description: "مشاوره دوران نوجوانی و بلوغ", category: "consultant", userCount: 2, isActive: true },
    { id: "30", title: "ترک اعتیاد", description: "مشاوره و درمان اعتیاد", category: "consultant", userCount: 1, isActive: true },
    
    // تخصص‌های کارشناسی
    { id: "31", title: "وکیل", description: "مشاوره حقوقی و وکالت", category: "expert", userCount: 5, isActive: true },
  ])
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as 'doctor' | 'consultant' | 'expert' | "",
  })

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
    })
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.category) {
      alert("لطفاً تمام فیلدها را پر کنید")
      return
    }

    setIsLoading(true)

    // شبیه‌سازی تاخیر برای عملیات
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const specialtyData = {
      id: editingId || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category as 'doctor' | 'consultant' | 'expert',
      userCount: editingId ? specialties.find((s) => s.id === editingId)?.userCount || 0 : 0,
      isActive: true,
    }

    if (editingId) {
      setSpecialties(specialties.map((specialty) => (specialty.id === editingId ? specialtyData : specialty)))
    } else {
      setSpecialties([...specialties, specialtyData])
    }

    resetForm()
    setIsLoading(false)
  }

  const handleEdit = (specialty: Specialty) => {
    setFormData({
      title: specialty.title,
      description: specialty.description,
      category: specialty.category,
    })
    setEditingId(specialty.id)
  }

  const handleDelete = async (id: string) => {
    const specialty = specialties.find((s) => s.id === id)
    if (specialty && specialty.userCount > 0) {
      alert("نمی‌توانید تخصصی را که کاربر دارد حذف کنید")
      return
    }

    if (confirm("آیا از حذف این تخصص اطمینان دارید؟")) {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))
      setSpecialties(specialties.filter((specialty) => specialty.id !== id))
      setIsLoading(false)
    }
  }

  const toggleActive = async (id: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setSpecialties(
      specialties.map((specialty) =>
        specialty.id === id ? { ...specialty, isActive: !specialty.isActive } : specialty,
      ),
    )
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="md:mr-80">
        <div className="max-w-6xl mx-auto p-6 space-y-6 font-vazir" dir="rtl">
          {/* Form */}
          <Card>
            <CardHeader className="card-header">
              <CardTitle className="text-right flex items-center gap-2">
                <Hospital className="h-5 w-5" />
                {editingId ? "ویرایش تخصص" : "افزودن تخصص جدید"}
              </CardTitle>
              <CardDescription className="text-right">
                اطلاعات تخصص مورد نظر را در سیستم بانوبان وارد کنید
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-right block">
                      عنوان تخصص
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="مثال: پزشک عمومی"
                      className="text-right"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-right block">
                      نوع دفتر
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as 'doctor' | 'consultant' | 'expert' })}>
                      <SelectTrigger className="text-right" dir="rtl">
                        <SelectValue placeholder="انتخاب کنید" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="doctor">پزشک</SelectItem>
                        <SelectItem value="consultant">مشاور</SelectItem>
                        <SelectItem value="expert">کارشناس</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-right block">
                      توضیحات
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="توضیح مختصری از تخصص..."
                      className="text-right"
                      dir="rtl"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="button-group">
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1" disabled={isLoading}>
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {editingId ? "در حال بروزرسانی..." : "در حال ثبت..."}
                        </div>
                      ) : editingId ? (
                        "بروزرسانی"
                      ) : (
                        "ثبت تخصص"
                      )}
                    </Button>
                    {editingId && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        انصراف
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Specialties List */}
          <Card>
            <CardHeader className="card-header">
              <CardTitle className="text-right">لیست تخصص‌ها</CardTitle>
              <CardDescription className="text-right">
                {toPersianDigits(specialties.length.toString())} تخصص در سیستم بانوبان ثبت شده
              </CardDescription>
            </CardHeader>
            <CardContent>
              {specialties.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">هنوز تخصصی ثبت نشده است</div>
              ) : (
                <div className="services-table">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">تخصص</TableHead>
                        <TableHead className="text-right">نوع دفتر</TableHead>
                        <TableHead className="text-right">توضیحات</TableHead>
                        <TableHead className="text-right">تعداد کاربران</TableHead>
                        <TableHead className="text-right">وضعیت</TableHead>
                        <TableHead className="text-left actions-column">عملیات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {specialties.map((specialty) => (
                        <TableRow
                          key={specialty.id}
                          className={`transition-opacity ${specialty.isActive ? "opacity-100" : "opacity-60"}`}
                        >
                          <TableCell className="font-medium text-right">
                            <div className="flex items-center gap-2">
                              {getSpecialtyIcon(specialty.title)}
                              {specialty.title}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={getCategoryColor(specialty.category)}>
                              {getCategoryName(specialty.category)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{specialty.description}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-blue-600" />
                              <span>{toPersianDigits(specialty.userCount.toString())} نفر</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2">
                              {specialty.isActive ? (
                                <>
                                  <Eye className="h-4 w-4 text-green-600" />
                                  <span className="text-xs text-green-600">فعال</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-4 w-4 text-red-600" />
                                  <span className="text-xs text-red-600">غیرفعال</span>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="actions-column">
                            <div className="button-group">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleActive(specialty.id)}
                                  title={specialty.isActive ? "غیرفعال کردن" : "فعال کردن"}
                                  disabled={isLoading}
                                >
                                  {specialty.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(specialty)}
                                  title="ویرایش"
                                  disabled={isLoading}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>

                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(specialty.id)}
                                  title="حذف"
                                  disabled={isLoading || specialty.userCount > 0}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
