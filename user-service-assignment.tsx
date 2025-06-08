"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Edit, Users, Settings } from "lucide-react"

import { SearchableList } from "./components/searchable-list"
import { toPersianDigits, formatPersianNumber } from "./utils/persian-utils"

interface User {
  id: string
  name: string
  email: string
  specialty: string
  isActive: boolean
}

interface Service {
  id: string
  title: string
  amount: number
  serviceType: "inPerson" | "online"
  isActive: boolean
}

interface Assignment {
  id: string
  userId: string
  userName: string
  userSpecialty: string
  serviceIds: string[]
  services: Service[]
}

export default function UserServiceAssignment() {
  // Sample medical staff data
  const [users] = useState<User[]>([
    { id: "1", name: "دکتر احمد محمدی", email: "ahmad@banoban.com", specialty: "پزشک عمومی", isActive: true },
    { id: "2", name: "فاطمه احمدی", email: "fateme@banoban.com", specialty: "پرستار", isActive: true },
    { id: "3", name: "علی رضایی", email: "ali@banoban.com", specialty: "پرستار", isActive: true },
    { id: "4", name: "مریم حسینی", email: "maryam@banoban.com", specialty: "پزشک متخصص", isActive: false },
    { id: "5", name: "زهرا کریمی", email: "zahra@banoban.com", specialty: "پرستار", isActive: true },
    { id: "6", name: "دکتر حسن موسوی", email: "hassan@banoban.com", specialty: "پزشک متخصص", isActive: true },
    { id: "7", name: "سارا کریمی", email: "sara@banoban.com", specialty: "پرستار", isActive: true },
    { id: "8", name: "دکتر نرگس احمدی", email: "narges@banoban.com", specialty: "پزشک عمومی", isActive: true },
  ])

  // Medical services data
  const [services] = useState<Service[]>([
    { id: "1", title: "تزریقات", amount: 750000, serviceType: "inPerson", isActive: true },
    { id: "2", title: "سرم‌تراپی بدون اقامت پرستار", amount: 550000, serviceType: "inPerson", isActive: true },
    {
      id: "3",
      title: "سرم‌تراپی با تزریق در سرم بدون اقامت پرستار",
      amount: 700000,
      serviceType: "inPerson",
      isActive: true,
    },
    {
      id: "4",
      title: "سرم تراپی با اقامت پرستار تا پایان سرم",
      amount: 950000,
      serviceType: "inPerson",
      isActive: true,
    },
    { id: "5", title: "سونداژ", amount: 750000, serviceType: "inPerson", isActive: true },
    { id: "6", title: "پانسمان", amount: 400000, serviceType: "inPerson", isActive: true },
    { id: "7", title: "اندازه‌گیری فشار خون", amount: 200000, serviceType: "inPerson", isActive: true },
    { id: "8", title: "تست قند خون", amount: 150000, serviceType: "inPerson", isActive: true },
    { id: "9", title: "ECG (نوار قلب)", amount: 300000, serviceType: "inPerson", isActive: true },
    { id: "10", title: "مشاوره آنلاین", amount: 180000, serviceType: "online", isActive: true },
  ])

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "1",
      userId: "1",
      userName: "دکتر احمد محمدی",
      userSpecialty: "پزشک عمومی",
      serviceIds: ["1", "7", "8"],
      services: [
        { id: "1", title: "تزریقات", amount: 750000, serviceType: "inPerson", isActive: true },
        { id: "7", title: "اندازه‌گیری فشار خون", amount: 200000, serviceType: "inPerson", isActive: true },
        { id: "8", title: "تست قند خون", amount: 150000, serviceType: "inPerson", isActive: true },
      ],
    },
    {
      id: "2",
      userId: "6",
      userName: "دکتر حسن موسوی",
      userSpecialty: "پزشک متخصص",
      serviceIds: ["10", "9"],
      services: [
        { id: "10", title: "مشاوره آنلاین", amount: 180000, serviceType: "online", isActive: true },
        { id: "9", title: "ECG (نوار قلب)", amount: 300000, serviceType: "inPerson", isActive: true },
      ],
    },
    {
      id: "3",
      userId: "2",
      userName: "فاطمه احمدی",
      userSpecialty: "پرستار",
      serviceIds: ["2", "6"],
      services: [
        { id: "2", title: "سرم‌تراپی بدون اقامت پرستار", amount: 550000, serviceType: "inPerson", isActive: true },
        { id: "6", title: "پانسمان", amount: 400000, serviceType: "inPerson", isActive: true },
      ],
    },
    {
      id: "4",
      userId: "8",
      userName: "دکتر نرگس احمدی",
      userSpecialty: "پزشک عمومی",
      serviceIds: ["1", "5", "10"],
      services: [
        { id: "1", title: "تزریقات", amount: 750000, serviceType: "inPerson", isActive: true },
        { id: "5", title: "سونداژ", amount: 750000, serviceType: "inPerson", isActive: true },
        { id: "10", title: "مشاوره آنلاین", amount: 180000, serviceType: "online", isActive: true },
      ],
    },
    {
      id: "5",
      userId: "3",
      userName: "علی رضایی",
      userSpecialty: "پرستار",
      serviceIds: ["4"],
      services: [
        {
          id: "4",
          title: "سرم تراپی با اقامت پرستار تا پایان سرم",
          amount: 950000,
          serviceType: "inPerson",
          isActive: true,
        },
      ],
    },
  ])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleUserSelection = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    }
  }

  const handleServiceSelection = (serviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedServices([...selectedServices, serviceId])
    } else {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId))
    }
  }

  const handleAssign = async () => {
    if (selectedUsers.length === 0 || selectedServices.length === 0) {
      alert("لطفاً حداقل یک کاربر و یک خدمت انتخاب کنید")
      return
    }

    setIsLoading(true)

    // شبیه‌سازی تاخیر برای عملیات
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const newAssignments: Assignment[] = selectedUsers.map((userId) => {
      const user = users.find((u) => u.id === userId)!
      const assignedServices = services.filter((s) => selectedServices.includes(s.id))

      return {
        id: editingId || `${userId}-${Date.now()}`,
        userId,
        userName: user.name,
        userSpecialty: user.specialty,
        serviceIds: selectedServices,
        services: assignedServices,
      }
    })

    if (editingId) {
      setAssignments(assignments.filter((a) => a.id !== editingId).concat(newAssignments))
    } else {
      setAssignments([...assignments, ...newAssignments])
    }

    // Reset selections
    setSelectedUsers([])
    setSelectedServices([])
    setEditingId(null)
    setIsLoading(false)
  }

  const handleEdit = (assignment: Assignment) => {
    setSelectedUsers([assignment.userId])
    setSelectedServices(assignment.serviceIds)
    setEditingId(assignment.id)
  }

  const handleDelete = async (id: string) => {
    if (confirm("آیا از حذف این تخصیص اطمینان دارید؟")) {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))
      setAssignments(assignments.filter((a) => a.id !== id))
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedUsers([])
    setSelectedServices([])
    setEditingId(null)
  }

  const getServiceTypeText = (serviceType: "inPerson" | "online") => {
    switch (serviceType) {
      case "inPerson":
        return "حضوری"
      case "online":
        return "آنلاین"
      default:
        return ""
    }
  }

  // Prepare data for searchable lists
  const userItems = users
    .filter((user) => user.isActive)
    .map((user) => ({
      id: user.id,
      title: user.name,
      badge: user.specialty,
    }))

  const serviceItems = services
    .filter((service) => service.isActive)
    .map((service) => ({
      id: service.id,
      title: service.title,
      amount: service.amount,
      badge: getServiceTypeText(service.serviceType),
    }))

  return (
    <div className="space-y-6">
        <div className="max-w-7xl mx-auto p-6 space-y-6 font-vazir" dir="rtl">
          {/* Assignment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {editingId ? "ویرایش تخصیص خدمات پزشکی" : "تخصیص خدمات پزشکی به کادر درمان"}
              </CardTitle>
              <CardDescription className="text-right">کادر درمان و خدمات پزشکی مورد نظر را انتخاب کنید</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Users List - Right Side */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <h3 className="text-lg font-medium">انتخاب کادر درمان</h3>
                  </div>
                  <SearchableList
                    items={userItems}
                    selectedItems={selectedUsers}
                    onItemSelect={handleUserSelection}
                    placeholder="جستجو در کادر درمان..."
                  />
                  <p className="text-sm text-muted-foreground">
                    {toPersianDigits(selectedUsers.length.toString())} نفر انتخاب شده
                  </p>
                </div>

                {/* Services List - Left Side */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    <h3 className="text-lg font-medium">انتخاب خدمات پزشکی</h3>
                  </div>
                  <SearchableList
                    items={serviceItems}
                    selectedItems={selectedServices}
                    onItemSelect={handleServiceSelection}
                    placeholder="جستجو در خدمات پزشکی..."
                    formatAmount={(amount) => `${formatPersianNumber(amount)} تومان`}
                  />
                  <p className="text-sm text-muted-foreground">
                    {toPersianDigits(selectedServices.length.toString())} خدمت انتخاب شده
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 button-group">
                <div className="flex gap-3">
                  <Button
                    onClick={handleAssign}
                    disabled={selectedUsers.length === 0 || selectedServices.length === 0 || isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {editingId ? "در حال بروزرسانی..." : "در حال افزودن..."}
                      </div>
                    ) : editingId ? (
                      "بروزرسانی تخصیص"
                    ) : (
                      "افزودن تخصیص"
                    )}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      انصراف
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignments List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">لیست تخصیص خدمات پزشکی</CardTitle>
              <CardDescription className="text-right">
                {toPersianDigits(assignments.length.toString())} تخصیص ثبت شده
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assignments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">هنوز تخصیصی ثبت نشده است</div>
              ) : (
                <div className="services-table">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">کادر درمان</TableHead>
                        <TableHead className="text-right">تخصص</TableHead>
                        <TableHead className="text-right">خدمات تخصیص یافته</TableHead>
                        <TableHead className="text-left actions-column">عملیات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell className="font-medium text-right">{assignment.userName}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary" className="text-xs">
                              {assignment.userSpecialty}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-wrap gap-1">
                              {assignment.services.map((service) => (
                                <Badge key={service.id} variant="outline" className="text-xs">
                                  {service.title}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="actions-column">
                            <div className="button-group">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(assignment)}
                                  title="ویرایش"
                                  disabled={isLoading}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(assignment.id)}
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
  )
}
