"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { 
  Building, MapPin, Phone, Mail, Calendar, Users, 
  Edit, Save, X, Plus, Eye, Trash2, 
  ArrowLeft, UserPlus, UserCheck, UserX, Search
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

// تابع برای تبدیل اعداد فارسی به انگلیسی
const toEnglishNumber = (str: string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  let result = str
  for (let i = 0; i < persianDigits.length; i++) {
    result = result.replace(new RegExp(persianDigits[i], 'g'), englishDigits[i])
  }
  return result
}

interface User {
  id: string
  nationalId: string
  name: string
  email?: string
  phone?: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  joinDate: string
  avatar?: string
}

interface Office {
  id: string
  title: string
  type: 'doctor' | 'consultant' | 'expert'
  owner: string
}

// Mock data
const mockOffice: Office = {
  id: "1",
  title: "مطب دکتر احمدی",
  type: "doctor",
  owner: "دکتر علی احمدی"
}

const mockUsers: User[] = [
  {
    id: "1",
    nationalId: "۱۲۳۴۵۶۷۸۹۰",
    name: "احمد محمدی",
    email: "ahmad@example.com",
    phone: "۰۹۱۲۳۴۵۶۷۸۹",
    role: "پزشک",
    status: "active",
    joinDate: "۱۴۰۳/۰۳/۱۵"
  },
  {
    id: "2",
    nationalId: "۰۹۸۷۶۵۴۳۲۱",
    name: "سارا کریمی",
    email: "sara@example.com",
    phone: "۰۹۳۳۴۴۵۵۶۶۷",
    role: "منشی",
    status: "active",
    joinDate: "۱۴۰۳/۰۲/۲۰"
  },
  {
    id: "3",
    nationalId: "۵۵۵۵۵۵۵۵۵۵",
    name: "رضا نوری",
    email: "reza@example.com",
    role: "دستیار",
    status: "pending",
    joinDate: "۱۴۰۳/۰۴/۰۱"
  }
]

const roles = [
  "پزشک",
  "منشی", 
  "دستیار",
  "پرستار",
  "کارشناس",
  "مشاور"
]

export default function OfficeUsersManagement() {
  const params = useParams()
  const router = useRouter()
  const [office, setOffice] = useState<Office>(mockOffice)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchNationalId, setSearchNationalId] = useState("")
  const [newUser, setNewUser] = useState<Partial<User>>({
    nationalId: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "pending"
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadFont()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">فعال</Badge>
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">غیرفعال</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">در انتظار تایید</Badge>
      default:
        return <Badge variant="secondary">نامشخص</Badge>
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.includes(searchTerm) || 
                         user.nationalId.includes(searchTerm) ||
                         (user.email && user.email.includes(searchTerm))
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    const matchesRole = filterRole === "all" || user.role === filterRole

    return matchesSearch && matchesStatus && matchesRole
  })

  const handleSearchUser = () => {
    const englishNationalId = toEnglishNumber(searchNationalId)
    
    if (englishNationalId === "1111111111") {
      const foundUser = {
        nationalId: searchNationalId,
        name: "علی رضایی",
        email: "ali@example.com",
        phone: "۰۹۱۱۲۲۳۳۴۴۵",
        role: ""
      }
      setNewUser(foundUser)
    } else {
      setNewUser({
        nationalId: searchNationalId,
        name: "",
        email: "",
        phone: "",
        role: "",
        status: "pending"
      })
    }
  }

  const handleAddUser = () => {
    if (newUser.nationalId && newUser.name && newUser.role) {
      const user: User = {
        id: Date.now().toString(),
        nationalId: newUser.nationalId!,
        name: newUser.name!,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role!,
        status: newUser.status as 'active' | 'inactive' | 'pending',
        joinDate: new Date().toLocaleDateString('fa-IR')
      }
      setUsers(prev => [...prev, user])
      setNewUser({
        nationalId: "",
        name: "",
        email: "",
        phone: "",
        role: "",
        status: "pending"
      })
      setSearchNationalId("")
      setAddUserDialogOpen(false)
    }
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditUserDialogOpen(true)
  }

  const handleUpdateUser = () => {
    if (selectedUser) {
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? selectedUser : u))
      setEditUserDialogOpen(false)
      setSelectedUser(null)
    }
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId))
    setDeleteDialogOpen(null)
  }

  const handleStatusChange = (userId: string, newStatus: 'active' | 'inactive' | 'pending') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u))
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
          onClick={() => router.push('/offices/list')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          بازگشت به لیست دفاتر
        </Button>
        <div className="text-right">
          <h1 className="text-3xl font-bold text-gray-900">مدیریت کاربران</h1>
          <p className="text-gray-600 mt-2">{office.title}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-600">کل کاربران</p>
                <p className="text-2xl font-bold">{toPersianNumber(users.length)}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-600">فعال</p>
                <p className="text-2xl font-bold text-green-600">
                  {toPersianNumber(users.filter(u => u.status === 'active').length)}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-600">در انتظار تایید</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {toPersianNumber(users.filter(u => u.status === 'pending').length)}
                </p>
              </div>
              <UserPlus className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-600">غیرفعال</p>
                <p className="text-2xl font-bold text-red-600">
                  {toPersianNumber(users.filter(u => u.status === 'inactive').length)}
                </p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-4 items-center">
              <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    افزودن کاربر جدید
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="جستجو در نام، کد ملی یا ایمیل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                  dir="rtl"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger dir="rtl">
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="active">فعال</SelectItem>
                  <SelectItem value="pending">در انتظار تایید</SelectItem>
                  <SelectItem value="inactive">غیرفعال</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger dir="rtl">
                  <SelectValue placeholder="نقش" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه نقش‌ها</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="text-right mb-4">
        <p className="text-gray-600">
          {toPersianNumber(filteredUsers.length)} کاربر از {toPersianNumber(users.length)} کاربر یافت شد
        </p>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-blue-100">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-right">
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    <p className="text-sm text-gray-600">کد ملی: {user.nationalId}</p>
                    <p className="text-sm text-gray-600">نقش: {user.role}</p>
                    {user.email && (
                      <p className="text-sm text-gray-600">ایمیل: {user.email}</p>
                    )}
                    {user.phone && (
                      <p className="text-sm text-gray-600">تلفن: {user.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">تاریخ عضویت</p>
                    <p className="text-sm font-medium">{user.joinDate}</p>
                  </div>
                  {getStatusBadge(user.status)}
                  
                  <div className="flex gap-2">
                    {user.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(user.id, 'active')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        تایید
                      </Button>
                    )}
                    {user.status === 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(user.id, 'inactive')}
                      >
                        غیرفعال
                      </Button>
                    )}
                    {user.status === 'inactive' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(user.id, 'active')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        فعال‌سازی
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">کاربری یافت نشد</h3>
            <p className="text-gray-600 mb-6">
              با فیلترهای انتخاب شده هیچ کاربری پیدا نشد. لطفاً فیلترها را تغییر دهید.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("")
              setFilterStatus("all")
              setFilterRole("all")
            }}>
              پاک کردن فیلترها
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add User Dialog */}
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">افزودن کاربر جدید</DialogTitle>
          <DialogDescription className="text-right">
            کد ملی کاربر جدید را وارد کنید و اطلاعات آن را تکمیل نمایید.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="کد ملی"
              value={searchNationalId}
              onChange={(e) => setSearchNationalId(e.target.value)}
              className="text-right"
              dir="rtl"
            />
            <Button onClick={handleSearchUser}>جستجو</Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-right">نام و نام خانوادگی</Label>
              <Input
                value={newUser.name || ""}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                className="text-right"
                dir="rtl"
              />
            </div>
            <div>
              <Label className="text-right">ایمیل</Label>
              <Input
                type="email"
                value={newUser.email || ""}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                className="text-right"
                dir="rtl"
              />
            </div>
            <div>
              <Label className="text-right">شماره تلفن</Label>
              <Input
                value={newUser.phone || ""}
                onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                className="text-right"
                dir="rtl"
              />
            </div>
            <div>
              <Label className="text-right">نقش</Label>
              <Select value={newUser.role || ""} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                <SelectTrigger dir="rtl">
                  <SelectValue placeholder="نقش را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>
              انصراف
            </Button>
            <Button onClick={handleAddUser}>
              افزودن کاربر
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Edit User Dialog */}
      <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">ویرایش کاربر</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label className="text-right">نام و نام خانوادگی</Label>
                <Input
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="text-right"
                  dir="rtl"
                />
              </div>
              <div>
                <Label className="text-right">ایمیل</Label>
                <Input
                  type="email"
                  value={selectedUser.email || ""}
                  onChange={(e) => setSelectedUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                  className="text-right"
                  dir="rtl"
                />
              </div>
              <div>
                <Label className="text-right">شماره تلفن</Label>
                <Input
                  value={selectedUser.phone || ""}
                  onChange={(e) => setSelectedUser(prev => prev ? { ...prev, phone: e.target.value } : null)}
                  className="text-right"
                  dir="rtl"
                />
              </div>
              <div>
                <Label className="text-right">نقش</Label>
                <Select value={selectedUser.role} onValueChange={(value) => setSelectedUser(prev => prev ? { ...prev, role: value } : null)}>
                  <SelectTrigger dir="rtl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditUserDialogOpen(false)}>
                  انصراف
                </Button>
                <Button onClick={handleUpdateUser}>
                  ذخیره تغییرات
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDialogOpen} onOpenChange={() => setDeleteDialogOpen(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">تایید حذف</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟ این عمل قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialogOpen && handleDeleteUser(deleteDialogOpen)}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 