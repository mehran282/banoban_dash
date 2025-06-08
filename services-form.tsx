"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Edit, Eye, EyeOff, Users, Monitor } from "lucide-react"
import { toPersianDigits, toEnglishDigits, formatPersianNumber } from "./utils/persian-utils"
import { ThreeWaySwitch } from "./components/three-way-switch"
import { Header } from "./components/header"

interface Service {
  id: string
  title: string
  amount: number
  serviceType: "inPerson" | "online"
  isActive: boolean
}

export default function ServicesForm() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      title: "تزریقات",
      amount: 750000,
      serviceType: "inPerson",
      isActive: true,
    },
    {
      id: "2",
      title: "مشاوره آنلاین",
      amount: 300000,
      serviceType: "online",
      isActive: true,
    },
    {
      id: "3",
      title: "سرم‌تراپی",
      amount: 950000,
      serviceType: "inPerson",
      isActive: false,
    },
    {
      id: "4",
      title: "ویزیت آنلاین",
      amount: 500000,
      serviceType: "online",
      isActive: true,
    },
    {
      id: "5",
      title: "پانسمان",
      amount: 400000,
      serviceType: "inPerson",
      isActive: false,
    },
    {
      id: "6",
      title: "مشاوره تخصصی آنلاین",
      amount: 800000,
      serviceType: "online",
      isActive: true,
    },
  ])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    serviceType: "inPerson" as "inPerson" | "online",
  })

  const resetForm = () => {
    setFormData({
      title: "",
      amount: "",
      serviceType: "inPerson",
    })
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.amount) {
      alert("لطفاً تمام فیلدها را پر کنید")
      return
    }

    setIsLoading(true)

    // شبیه‌سازی تاخیر برای عملیات
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // تبدیل اعداد فارسی به انگلیسی برای محاسبه
    const englishAmount = toEnglishDigits(formData.amount)

    const serviceData = {
      id: editingId || Date.now().toString(),
      title: formData.title,
      amount: Number.parseFloat(englishAmount),
      serviceType: formData.serviceType,
      isActive: true,
    }

    if (editingId) {
      setServices(services.map((service) => (service.id === editingId ? serviceData : service)))
    } else {
      setServices([...services, serviceData])
    }

    resetForm()
    setIsLoading(false)
  }

  const handleEdit = (service: Service) => {
    setFormData({
      title: service.title,
      amount: toPersianDigits(service.amount.toString()),
      serviceType: service.serviceType,
    })
    setEditingId(service.id)
  }

  const handleDelete = async (id: string) => {
    if (confirm("آیا از حذف این خدمت اطمینان دارید؟")) {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))
      setServices(services.filter((service) => service.id !== id))
      setIsLoading(false)
    }
  }

  const toggleActive = async (id: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setServices(services.map((service) => (service.id === id ? { ...service, isActive: !service.isActive } : service)))
    setIsLoading(false)
  }

  const getServiceTypeText = (serviceType: "inPerson" | "online") => {
    switch (serviceType) {
      case "inPerson":
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-xs text-blue-600">حضوری</span>
          </div>
        )
      case "online":
        return (
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-green-600" />
            <span className="text-xs text-green-600">آنلاین</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">نامشخص</span>
          </div>
        )
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // اجازه ورود اعداد فارسی و انگلیسی
    const persianValue = toPersianDigits(toEnglishDigits(value))
    setFormData({ ...formData, amount: persianValue })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="md:mr-80">
        <div className="max-w-6xl mx-auto p-6 space-y-6 font-vazir" dir="rtl">
          {/* Form */}
          <Card>
            <CardHeader className="card-header">
              <CardTitle className="text-right">{editingId ? "ویرایش خدمت" : "افزودن خدمت جدید"}</CardTitle>
              <CardDescription className="text-right">
                اطلاعات خدمت مورد نظر را در سیستم بانوبان وارد کنید
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-right block">
                      عنوان خدمت
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="مثال: مشاوره کسب و کار"
                      className="text-right"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-right block">
                      مبلغ (تومان)
                    </Label>
                    <Input
                      id="amount"
                      type="text"
                      value={formData.amount}
                      onChange={handleAmountChange}
                      placeholder={`مثال: ${toPersianDigits("500000")}`}
                      className="text-right"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-right block">نوع خدمت</Label>
                    <ThreeWaySwitch
                      value={formData.serviceType}
                      onChange={(value) => setFormData({ ...formData, serviceType: value })}
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
                        "ثبت خدمت"
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

          {/* Services List */}
          <Card>
            <CardHeader className="card-header">
              <CardTitle className="text-right">لیست خدمات</CardTitle>
              <CardDescription className="text-right">
                {toPersianDigits(services.length.toString())} خدمت در سیستم بانوبان ثبت شده
              </CardDescription>
            </CardHeader>
            <CardContent>
              {services.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">هنوز خدمتی ثبت نشده است</div>
              ) : (
                <div className="services-table">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">عنوان خدمت</TableHead>
                        <TableHead className="text-right">مبلغ</TableHead>
                        <TableHead className="text-right">نوع خدمت</TableHead>
                        <TableHead className="text-right">وضعیت</TableHead>
                        <TableHead className="text-left actions-column">عملیات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.map((service) => (
                        <TableRow
                          key={service.id}
                          className={`transition-opacity ${service.isActive ? "opacity-100" : "opacity-60"}`}
                        >
                          <TableCell className="font-medium text-right">{service.title}</TableCell>
                          <TableCell className="text-right">{formatPersianNumber(service.amount)} تومان</TableCell>
                          <TableCell className="text-right">{getServiceTypeText(service.serviceType)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2">
                              {service.isActive ? (
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
                                  onClick={() => toggleActive(service.id)}
                                  title={service.isActive ? "غیرفعال کردن" : "فعال کردن"}
                                  disabled={isLoading}
                                >
                                  {service.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(service)}
                                  title="ویرایش"
                                  disabled={isLoading}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>

                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(service.id)}
                                  title="حذف"
                                  disabled={isLoading}
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
