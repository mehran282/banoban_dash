"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building, MapPin, Phone, Search, Plus, Eye, Edit, Stethoscope, Scale, MessageCircle } from "lucide-react"


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
  address: string
  city: string
  province: string
  status: 'active' | 'pending' | 'suspended'
  logo?: string
  registrationDate: string
  documentsCount: number
  usersCount: number
}

// Mock data
const mockOffices: Office[] = [
  {
    id: "1",
    title: "مطب دکتر احمدی",
    type: "doctor",
    owner: "دکتر علی احمدی",
    phone: "۰۲۱-۲۲۳۴۵۶۷۸",
    address: "تهران، خیابان ولیعصر، پلاک ۱۲۳",
    city: "تهران",
    province: "تهران",
    status: "active",
    registrationDate: "۱۴۰۳/۰۳/۱۵",
    documentsCount: 5,
    usersCount: 3
  },
  {
    id: "2", 
    title: "دفتر مشاوره نوری",
    type: "consultant",
    owner: "محمد نوری",
    phone: "۰۲۱-۸۸۷۷۶۶۵۵",
    address: "تهران، خیابان انقلاب، پلاک ۴۵۶",
    city: "تهران",
    province: "تهران",
    status: "active",
    registrationDate: "۱۴۰۳/۰۲/۲۰",
    documentsCount: 8,
    usersCount: 2
  },
  {
    id: "3",
    title: "دفتر کارشناسی رضوی",
    type: "expert",
    owner: "کارشناس رضا پور",
    phone: "۰۵۱-۳۳۲۲۱۱۰۰",
    address: "مشهد، خیابان امام رضا، پلاک ۷۸۹",
    city: "مشهد",
    province: "خراسان رضوی",
    status: "pending",
    registrationDate: "۱۴۰۳/۰۴/۰۱",
    documentsCount: 6,
    usersCount: 1
  },
  {
    id: "4",
    title: "مطب دندانپزشکی میرزایی",
    type: "doctor",
    owner: "دکتر سارا میرزایی",
    phone: "۰۲۱-۴۴۳۳۲۲۱۱",
    address: "تهران، خیابان شریعتی، پلاک ۳۲۱",
    city: "تهران",
    province: "تهران",
    status: "active",
    registrationDate: "۱۴۰۳/۰۱/۱۰",
    documentsCount: 7,
    usersCount: 4
  },
  {
    id: "5",
    title: "دفتر مشاوره خانواده کریمی",
    type: "consultant",
    owner: "دکتر فاطمه کریمی",
    phone: "۰۲۱-۵۵۶۶۷۷۸۸",
    address: "تهران، خیابان کریمخان، پلاک ۱۵۴",
    city: "تهران",
    province: "تهران",
    status: "suspended",
    registrationDate: "۱۴۰۳/۰۲/۰۵",
    documentsCount: 4,
    usersCount: 1
  }
]

export default function OfficesList() {
  const router = useRouter()
  const [offices, setOffices] = useState<Office[]>(mockOffices)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterProvince, setFilterProvince] = useState<string>("all")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'doctor': return <Stethoscope className="h-4 w-4" />
      case 'consultant': return <MessageCircle className="h-4 w-4" />
      case 'expert': return <Scale className="h-4 w-4" />
      default: return <Building className="h-4 w-4" />
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

  const filteredOffices = offices.filter(office => {
    const matchesSearch = office.title.includes(searchTerm) || 
                         office.owner.includes(searchTerm) ||
                         office.address.includes(searchTerm)
    const matchesType = !filterType || filterType === "all" || office.type === filterType
    const matchesStatus = !filterStatus || filterStatus === "all" || office.status === filterStatus
    const matchesProvince = !filterProvince || filterProvince === "all" || office.province === filterProvince

    return matchesSearch && matchesType && matchesStatus && matchesProvince
  })

  const provinces = Array.from(new Set(offices.map(office => office.province)))

  return (
    <div className="space-y-6">
      <div className="container mx-auto p-6 space-y-6" dir="rtl" style={{ fontFamily: 'Vazirmatn, Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">لیست دفاتر</h1>
              <p className="text-gray-600 mt-2">مدیریت و مشاهده تمام دفاتر ثبت شده</p>
            </div>
            <Button 
              onClick={() => router.push('/offices/register')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              ثبت دفتر جدید
            </Button>
          </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-600">کل دفاتر</p>
                <p className="text-2xl font-bold">{toPersianNumber(offices.length)}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-600">فعال</p>
                <p className="text-2xl font-bold text-green-600">
                  {toPersianNumber(offices.filter(o => o.status === 'active').length)}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-600">در انتظار</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {toPersianNumber(offices.filter(o => o.status === 'pending').length)}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-600">تعلیق شده</p>
                <p className="text-2xl font-bold text-red-600">
                  {toPersianNumber(offices.filter(o => o.status === 'suspended').length)}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="جستجو در نام دفتر، مالک یا آدرس..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                  dir="rtl"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger dir="rtl">
                <SelectValue placeholder="نوع دفتر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه انواع</SelectItem>
                <SelectItem value="doctor">پزشک</SelectItem>
                <SelectItem value="consultant">مشاور</SelectItem>
                <SelectItem value="expert">کارشناس</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger dir="rtl">
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="active">فعال</SelectItem>
                <SelectItem value="pending">در انتظار تایید</SelectItem>
                <SelectItem value="suspended">تعلیق شده</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterProvince} onValueChange={setFilterProvince}>
              <SelectTrigger dir="rtl">
                <SelectValue placeholder="استان" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه استان‌ها</SelectItem>
                {provinces.map(province => (
                  <SelectItem key={province} value={province}>{province}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="text-right mb-4">
        <p className="text-gray-600">
          {toPersianNumber(filteredOffices.length)} دفتر از {toPersianNumber(offices.length)} دفتر یافت شد
        </p>
      </div>

      {/* Offices Grid */}
      {mounted ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" suppressHydrationWarning={true}>
          {filteredOffices.map((office) => (
            <Card key={office.id} className="hover:shadow-lg transition-all cursor-pointer group">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={office.logo} />
                        <AvatarFallback className="bg-blue-100">
                          {getTypeIcon(office.type)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-right">
                        <h3 className="font-bold text-lg">{office.title}</h3>
                        <p className="text-sm text-gray-600">{office.owner}</p>
                      </div>
                    </div>
                    {getStatusBadge(office.status)}
                  </div>

                  {/* Type */}
                  <div className="flex items-center gap-2 justify-end">
                    {getTypeIcon(office.type)}
                    <span className="text-sm font-medium">{getTypeName(office.type)}</span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-sm text-gray-600">{office.phone}</span>
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-start gap-2 justify-end">
                      <span className="text-sm text-gray-600 text-right leading-relaxed">
                        {office.address}
                      </span>
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">تاریخ ثبت</p>
                      <p className="text-sm font-medium">{office.registrationDate}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">مدارک</p>
                      <p className="text-sm font-medium">{toPersianNumber(office.documentsCount)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">کاربران</p>
                      <p className="text-sm font-medium">{toPersianNumber(office.usersCount)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-sm"
                      onClick={() => router.push(`/offices/${office.id}`)}
                    >
                      <Eye className="h-4 w-4 ml-1" />
                      مشاهده پروفایل
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-sm"
                      onClick={() => router.push(`/offices/${office.id}/edit`)}
                    >
                      <Edit className="h-4 w-4 ml-1" />
                      ویرایش
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-40"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="h-3 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
                    </div>
                    <div className="text-center">
                      <div className="h-3 bg-gray-200 rounded w-8 mx-auto mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-6 mx-auto"></div>
                    </div>
                    <div className="text-center">
                      <div className="h-3 bg-gray-200 rounded w-10 mx-auto mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-4 mx-auto"></div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredOffices.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">دفتری یافت نشد</h3>
            <p className="text-gray-600 mb-6">
              با فیلترهای انتخاب شده هیچ دفتری پیدا نشد. لطفاً فیلترها را تغییر دهید.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("")
              setFilterType("all")
              setFilterStatus("all")
              setFilterProvince("all")
            }}>
              پاک کردن فیلترها
            </Button>
          </CardContent>
        </Card>
      )}
        </div>
    </div>
  )
}