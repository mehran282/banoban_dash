"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Edit, Search, ArrowUpDown, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react"
import { toPersianDigits, toEnglishDigits, formatPersianNumber } from "./utils/persian-utils"
import { Header } from "./components/header"

interface Medicine {
  id: string
  code: string
  name: string
  price: number
  usage: string
  isHidden: boolean
}

type SortField = "code" | "name" | "price" | "usage"
type SortDirection = "asc" | "desc"

export default function MedicinesForm() {
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: "1",
      code: "MED001234",
      name: "آسپرین",
      price: 25000,
      usage: "ضد درد و تب",
      isHidden: false,
    },
    {
      id: "2",
      code: "MED001235",
      name: "استامینوفن",
      price: 18000,
      usage: "ضد درد و تب",
      isHidden: false,
    },
    {
      id: "3",
      code: "MED001236",
      name: "آموکسی‌سیلین",
      price: 45000,
      usage: "آنتی‌بیوتیک",
      isHidden: true,
    },
    {
      id: "4",
      code: "MED001237",
      name: "ایبوپروفن",
      price: 32000,
      usage: "ضد التهاب",
      isHidden: false,
    },
    {
      id: "5",
      code: "MED001238",
      name: "سیپروفلوکساسین",
      price: 65000,
      usage: "آنتی‌بیوتیک",
      isHidden: false,
    },
    {
      id: "6",
      code: "MED001239",
      name: "دیکلوفناک",
      price: 28000,
      usage: "ضد التهاب و درد",
      isHidden: true,
    },
  ])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("code")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    usage: "",
  })

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      usage: "",
    })
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.usage) {
      alert("لطفاً تمام فیلدها را پر کنید")
      return
    }

    setIsLoading(true)

    // شبیه‌سازی تاخیر برای عملیات
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // تبدیل اعداد فارسی به انگلیسی برای محاسبه
    const englishPrice = toEnglishDigits(formData.price)

    // تولید کد خودکار
    const generateMedicineCode = () => {
      const prefix = "MED"
      const timestamp = Date.now().toString().slice(-6)
      return `${prefix}${timestamp}`
    }

    const medicineData = {
      id: editingId || Date.now().toString(),
      code: editingId
        ? medicines.find((m) => m.id === editingId)?.code || generateMedicineCode()
        : generateMedicineCode(),
      name: formData.name,
      price: Number.parseFloat(englishPrice),
      usage: formData.usage,
      isHidden: editingId ? medicines.find((m) => m.id === editingId)?.isHidden || false : false,
    }

    if (editingId) {
      setMedicines(medicines.map((medicine) => (medicine.id === editingId ? medicineData : medicine)))
    } else {
      setMedicines([...medicines, medicineData])
    }

    resetForm()
    setIsLoading(false)
  }

  const handleEdit = (medicine: Medicine) => {
    setFormData({
      name: medicine.name,
      price: toPersianDigits(medicine.price.toString()),
      usage: medicine.usage,
    })
    setEditingId(medicine.id)
  }

  const handleDelete = async (id: string) => {
    if (confirm("آیا از حذف این دارو اطمینان دارید؟")) {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))
      setMedicines(medicines.filter((medicine) => medicine.id !== id))
      setIsLoading(false)
    }
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // اجازه ورود اعداد فارسی و انگلیسی
    const persianValue = toPersianDigits(toEnglishDigits(value))
    setFormData({ ...formData, price: persianValue })
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 text-orange-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-orange-600" />
    )
  }

  const toggleHidden = async (id: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setMedicines(
      medicines.map((medicine) => (medicine.id === id ? { ...medicine, isHidden: !medicine.isHidden } : medicine)),
    )
    setIsLoading(false)
  }

  // فیلتر و مرتب‌سازی داروها
  const filteredAndSortedMedicines = useMemo(() => {
    const filtered = medicines.filter(
      (medicine) =>
        medicine.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.usage.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === "createdAt") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (sortField === "price") {
        aValue = Number(aValue)
        bValue = Number(bValue)
      } else {
        aValue = String(aValue).toLowerCase()
        bValue = String(bValue).toLowerCase()
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [medicines, searchTerm, sortField, sortDirection])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="md:mr-80">
        <div className="max-w-6xl mx-auto p-6 space-y-6 font-vazir" dir="rtl">
          {/* Form */}
          <Card>
            <CardHeader className="card-header">
              <CardTitle className="text-right">{editingId ? "ویرایش دارو" : "افزودن دارو جدید"}</CardTitle>
              <CardDescription className="text-right">
                اطلاعات دارو مورد نظر را در سیستم بانوبان وارد کنید
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-right block">
                      نام دارو
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="مثال: آسپرین"
                      className="text-right"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-right block">
                      مبلغ (تومان)
                    </Label>
                    <Input
                      id="price"
                      type="text"
                      value={formData.price}
                      onChange={handlePriceChange}
                      placeholder={`مثال: ${toPersianDigits("25000")}`}
                      className="text-right"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="usage" className="text-right block">
                      کاربرد
                    </Label>
                    <Input
                      id="usage"
                      value={formData.usage}
                      onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                      placeholder="مثال: ضد درد و تب"
                      className="text-right"
                      dir="rtl"
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
                        "ثبت دارو"
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

          {/* Medicines List */}
          <Card>
            <CardHeader className="card-header">
              <CardTitle className="text-right">لیست داروها</CardTitle>
              <CardDescription className="text-right">
                {toPersianDigits(filteredAndSortedMedicines.length.toString())} دارو از{" "}
                {toPersianDigits(medicines.length.toString())} دارو در سیستم بانوبان
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="جستجو در کد، نام دارو یا کاربرد..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              {filteredAndSortedMedicines.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "هیچ داروی مطابق با جستجو یافت نشد" : "هنوز داروی ثبت نشده است"}
                </div>
              ) : (
                <div className="services-table">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("code")}
                            className="h-auto p-0 font-medium hover:bg-transparent"
                          >
                            <div className="flex items-center gap-2">
                              <span>کد دارو</span>
                              {getSortIcon("code")}
                            </div>
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("name")}
                            className="h-auto p-0 font-medium hover:bg-transparent"
                          >
                            <div className="flex items-center gap-2">
                              <span>نام دارو</span>
                              {getSortIcon("name")}
                            </div>
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("price")}
                            className="h-auto p-0 font-medium hover:bg-transparent"
                          >
                            <div className="flex items-center gap-2">
                              <span>مبلغ</span>
                              {getSortIcon("price")}
                            </div>
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("usage")}
                            className="h-auto p-0 font-medium hover:bg-transparent"
                          >
                            <div className="flex items-center gap-2">
                              <span>کاربرد</span>
                              {getSortIcon("usage")}
                            </div>
                          </Button>
                        </TableHead>
                        <TableHead className="text-left actions-column">عملیات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedMedicines.map((medicine) => (
                        <TableRow
                          key={medicine.id}
                          className={`transition-opacity ${medicine.isHidden ? "opacity-50" : "opacity-100"}`}
                        >
                          <TableCell className="font-medium text-right">{medicine.code}</TableCell>
                          <TableCell className="font-medium text-right">{medicine.name}</TableCell>
                          <TableCell className="text-right">{formatPersianNumber(medicine.price)} تومان</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary" className="text-xs">
                              {medicine.usage}
                            </Badge>
                          </TableCell>
                          <TableCell className="actions-column">
                            <div className="button-group">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleHidden(medicine.id)}
                                  title={medicine.isHidden ? "نمایش" : "مخفی کردن"}
                                  disabled={isLoading}
                                >
                                  {medicine.isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(medicine)}
                                  title="ویرایش"
                                  disabled={isLoading}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>

                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(medicine.id)}
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
