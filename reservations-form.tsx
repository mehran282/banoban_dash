
import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Calendar as CalendarIcon,
  MessageSquare,
  RefreshCw,
  DollarSign,
  X,
  Filter,
  User,
  Clock,
  Phone,
  ArrowLeftRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  Hourglass,
  RotateCcw,
  MessageCircle,
  Mic,
  Video,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react"
import { toPersianDigits } from "./utils/persian-utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Doctor {
  id: string
  name: string
  specialty: string
}

interface Reservation {
  id: string
  patientName: string
  patientPhone: string
  doctorId: string
  doctorName: string
  doctorSpecialty: string
  date: string
  time: string
  service: string
  amount: number
  status: "بزودی" | "در حال مکالمه" | "تمام شده"
  paymentStatus: "paid" | "pending" | "refunded"
  callType: "text" | "voice" | "video"
  notes?: string
}

type FilterType = "today" | "week" | "all"
type SortableKeys = "patientName" | "doctorName" | "date" | "callType" | "status"

const persianNames = [
  "علی رضایی", "زهرا حسینی", "محمد اکبری", "فاطمه محمدی", "حسن کریمی",
  "مریم موسوی", "حسین جعفری", "سارا احمدی", "مهدی محمودی", "نرگس هاشمی",
  "رضا عزیزی", "آرزو صادقی", "امیر نوری", "الهام قاسمی", "سعید شریفی",
  "پریسا مرادی", "مجید یوسفی", "شیما کاظمی", "وحید اسدی", "رویا محمودی",
  "حمید قنبری", "نگار رستمی", "عباس طاهری", "سما محمودی", "اصغر داوودی",
  "بهاره صالحی", "مصطفی جوادی", "مبینا اکبری", "جواد زارعی", "هانیه مرادی"
]

export default function ReservationsForm() {
  const [doctors] = useState<Doctor[]>([
    { id: "1", name: "دکتر احمد محمدی", specialty: "پزشک عمومی" },
    { id: "2", name: "دکتر مریم حسینی", specialty: "پزشک متخصص" },
    { id: "3", name: "دکتر حسن موسوی", specialty: "پزشک متخصص" },
    { id: "4", name: "دکتر نرگس احمدی", specialty: "پزشک عمومی" },
  ])

  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "1",
      patientName: "علی احمدی",
      patientPhone: "09123456789",
      doctorId: "1",
      doctorName: "دکتر احمد محمدی",
      doctorSpecialty: "پزشک عمومی",
      date: "2024-01-15",
      time: "09:00",
      service: "ویزیت عمومی",
      amount: 500000,
      status: "تمام شده",
      paymentStatus: "paid",
      callType: "video",
    },
    {
      id: "2",
      patientName: "فاطمه کریمی",
      patientPhone: "09187654321",
      doctorId: "2",
      doctorName: "دکتر مریم حسینی",
      doctorSpecialty: "پزشک متخصص",
      date: "2024-01-15",
      time: "10:30",
      service: "مشاوره تخصصی",
      amount: 800000,
      status: "بزودی",
      paymentStatus: "paid",
      callType: "voice",
    },
    {
      id: "3",
      patientName: "محمد رضایی",
      patientPhone: "09198765432",
      doctorId: "1",
      doctorName: "دکتر احمد محمدی",
      doctorSpecialty: "پزشک عمومی",
      date: "2024-01-16",
      time: "14:00",
      service: "ویزیت عمومی",
      amount: 500000,
      status: "تمام شده",
      paymentStatus: "refunded",
      callType: "text",
    },
    {
      id: "4",
      patientName: "زهرا موسوی",
      patientPhone: "09112345678",
      doctorId: "3",
      doctorName: "دکتر حسن موسوی",
      doctorSpecialty: "پزشک متخصص",
      date: "2024-01-17",
      time: "11:00",
      service: "مشاوره آنلاین",
      amount: 300000,
      status: "بزودی",
      paymentStatus: "paid",
      callType: "video",
    },
    // رزروهای اضافی برای تست pagination
    ...Array.from({ length: 30 }, (_, i) => ({
      id: (i + 5).toString(),
      patientName: persianNames[i % persianNames.length],
      patientPhone: `0912345${String(i + 5).padStart(4, '0')}`,
      doctorId: ((i % 4) + 1).toString(),
      doctorName: [
        "دکتر احمد محمدی",
        "دکتر مریم حسینی", 
        "دکتر حسن موسوی",
        "دکتر نرگس احمدی"
      ][i % 4],
      doctorSpecialty: i % 2 === 0 ? "پزشک عمومی" : "پزشک متخصص",
      date: new Date(2024, 0, 15 + (i % 30)).toISOString().split('T')[0],
      time: `${9 + (i % 8)}:00`,
      service: i % 3 === 0 ? "ویزیت عمومی" : i % 3 === 1 ? "مشاوره تخصصی" : "مشاوره آنلاین",
      amount: (i % 3 + 1) * 250000,
      status: (["بزودی", "در حال مکالمه", "تمام شده"] as const)[i % 3],
      paymentStatus: (["paid", "pending", "refunded"] as const)[i % 3],
      callType: (["video", "voice", "text"] as const)[i % 3],
    })),
  ])

  const [selectedDoctor, setSelectedDoctor] = useState<string>("all")
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [transferReservation, setTransferReservation] = useState<Reservation | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: "ascending" | "descending" } | null>({
    key: "date",
    direction: "descending",
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  // Column filters
  const [columnFilters, setColumnFilters] = useState<{ 
    status: string[]
    callType: string[]
    patientName: string
    doctorName: string
  }>({
    status: [],
    callType: [],
    patientName: "",
    doctorName: "",
  })

  const filteredAndSortedReservations = useMemo(() => {
    let filtered = reservations.filter((reservation) => {
      // Apply column filters
      if (columnFilters.status.length > 0 && !columnFilters.status.includes(reservation.status)) {
        return false
      }
      if (columnFilters.callType.length > 0 && !columnFilters.callType.includes(reservation.callType)) {
        return false
      }
      if (columnFilters.patientName && !reservation.patientName.includes(columnFilters.patientName)) {
        return false
      }
      if (columnFilters.doctorName && !reservation.doctorName.includes(columnFilters.doctorName)) {
        return false
      }

      // Apply existing filters
      if (selectedDoctor !== "all" && reservation.doctorId !== selectedDoctor) return false

      const today = new Date()
      const reservationDate = new Date(reservation.date)

      switch (filterType) {
        case "today":
          return reservationDate.toDateString() === today.toDateString()
        case "week":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          return reservationDate >= weekAgo
        default:
          return true
      }
    })

    // Apply sorting
    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortConfig.key]
        let bValue: any = b[sortConfig.key]

        if (sortConfig.key === "date") {
          aValue = new Date(`${a.date} ${a.time}`)
          bValue = new Date(`${b.date} ${b.time}`)
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    return filtered
  }, [reservations, selectedDoctor, filterType, sortConfig, columnFilters])

  // Pagination calculations
  const totalItems = filteredAndSortedReservations.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentReservations = filteredAndSortedReservations.slice(startIndex, endIndex)

  const refreshData = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // In real app, fetch fresh data from API
    } catch (error) {
      console.error("خطا در بروزرسانی داده‌ها:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedDoctor, filterType, itemsPerPage, columnFilters])

  const cancelReservation = async (id: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setReservations((prev) => prev.filter((r) => r.id !== id))
    } catch (error) {
      console.error("خطا در لغو رزرو:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const refundPayment = async (id: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, paymentStatus: "refunded" as const } : r))
      )
    } catch (error) {
      console.error("خطا در بازگشت پول:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (reservationId: string, message: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Update reservation with message sent status
      console.log(`پیام برای رزرو ${reservationId}:`, message)
    } catch (error) {
      console.error("خطا در ارسال پیام:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const transferReservationSlot = async (fromId: string, toDate: string, toTime: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setReservations((prev) =>
        prev.map((r) => (r.id === fromId ? { ...r, date: toDate, time: toTime } : r))
      )
      setTransferReservation(null)
    } catch (error) {
      console.error("خطا در انتقال رزرو:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string, paymentStatus: string) => {
    // فقط در صورت پرداخت شدن وضعیت نمایش داده شود
    if (paymentStatus !== "paid") {
      return <span className="text-gray-400">-</span>
    }

    switch (status) {
      case "بزودی":
        return (
          <div className="flex items-center gap-1 text-orange-600">
            <Hourglass className="h-4 w-4" />
            <span>بزودی</span>
          </div>
        )
      case "در حال مکالمه":
        return (
          <div className="flex items-center gap-1 text-blue-600">
            <MessageCircle className="h-4 w-4" />
            <span>در حال مکالمه</span>
          </div>
        )
      case "تمام شده":
        return (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>تمام شده</span>
          </div>
        )
      default:
        return <span className="text-gray-400">-</span>
    }
  }

  const getPaymentBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "paid":
        return (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>پرداخت شده</span>
          </div>
        )
      case "pending":
        return (
          <div className="flex items-center gap-1 text-orange-600">
            <AlertCircle className="h-4 w-4" />
            <span>در انتظار پرداخت</span>
          </div>
        )
      case "refunded":
        return (
          <div className="flex items-center gap-1 text-red-600">
            <RotateCcw className="h-4 w-4" />
            <span>بازگشت داده شده</span>
          </div>
        )
      default:
        return <span className="text-gray-400">نامشخص</span>
    }
  }

  const getCallTypeBadge = (callType: string) => {
    switch (callType) {
      case "video":
        return (
          <div className="flex items-center gap-1 text-blue-600">
            <Video className="h-4 w-4" />
            <span>ویدیو</span>
          </div>
        )
      case "voice":
        return (
          <div className="flex items-center gap-1 text-green-600">
            <Mic className="h-4 w-4" />
            <span>صوتی</span>
          </div>
        )
      case "text":
        return (
          <div className="flex items-center gap-1 text-gray-600">
            <MessageSquare className="h-4 w-4" />
            <span>متنی</span>
          </div>
        )
      default:
        return <span className="text-gray-400">نامشخص</span>
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">مدیریت رزروها</h1>
          <p className="text-muted-foreground">رزروهای ویزیت و مشاوره</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refreshData} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            بروزرسانی
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>فیلتر رزروها</CardTitle>
          <CardDescription>رزروها را بر اساس معیارهای مختلف فیلتر کنید</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="doctor-filter">انتخاب پزشک</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="همه پزشکان" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه پزشکان</SelectItem>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-filter">فیلتر زمانی</Label>
              <Select value={filterType} onValueChange={(value: FilterType) => setFilterType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه زمان‌ها</SelectItem>
                  <SelectItem value="today">امروز</SelectItem>
                  <SelectItem value="week">این هفته</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>لیست رزروها</CardTitle>
          <CardDescription>
            {toPersianDigits(totalItems.toString())} رزرو یافت شد
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">
                    <div className="flex items-center gap-1">
                      <span>بیمار</span>
                      <PatientFilter columnFilters={columnFilters} setColumnFilters={setColumnFilters} />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center gap-1">
                      <span>پزشک</span>
                      <DoctorFilter columnFilters={columnFilters} setColumnFilters={setColumnFilters} />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortableHeader
                      title="زمان"
                      sortKey="date"
                      sortConfig={sortConfig}
                      setSortConfig={setSortConfig}
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    <SortableHeader
                      title="نوع مکالمه"
                      sortKey="callType"
                      sortConfig={sortConfig}
                      setSortConfig={setSortConfig}
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    <SortableHeader
                      title="وضعیت"
                      sortKey="status"
                      sortConfig={sortConfig}
                      setSortConfig={setSortConfig}
                    />
                  </TableHead>
                  <TableHead className="text-right">پرداخت</TableHead>
                  <TableHead className="text-left">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentReservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {reservation.patientName}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {toPersianDigits(reservation.patientPhone)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {reservation.doctorName}
                        </div>
                        <div className="text-sm text-muted-foreground">{reservation.doctorSpecialty}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <div className="text-sm">
                          <div>{formatDate(reservation.date)}</div>
                          <div className="text-muted-foreground">
                            ساعت {toPersianDigits(reservation.time)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getCallTypeBadge(reservation.callType)}</TableCell>
                    <TableCell>{getStatusBadge(reservation.status, reservation.paymentStatus)}</TableCell>
                    <TableCell>{getPaymentBadge(reservation.paymentStatus)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>ارسال پیام</DialogTitle>
                              <DialogDescription>
                                پیام برای {reservation.patientName}
                              </DialogDescription>
                            </DialogHeader>
                            <MessageForm
                              onSend={(message) => sendMessage(reservation.id, message)}
                              isLoading={isLoading}
                            />
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setTransferReservation(reservation)}
                            >
                              <ArrowLeftRight className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>انتقال رزرو</DialogTitle>
                              <DialogDescription>
                                انتقال رزرو {reservation.patientName} به زمان جدید
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="new-date">تاریخ جدید</Label>
                                <input
                                  type="date"
                                  id="new-date"
                                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="new-time">ساعت جدید</Label>
                                <input
                                  type="time"
                                  id="new-time"
                                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => {
                                    const dateInput = document.getElementById("new-date") as HTMLInputElement
                                    const timeInput = document.getElementById("new-time") as HTMLInputElement
                                    if (dateInput.value && timeInput.value) {
                                      transferReservationSlot(reservation.id, dateInput.value, timeInput.value)
                                    }
                                  }}
                                  disabled={isLoading}
                                >
                                  انتقال
                                </Button>
                                <Button variant="outline" onClick={() => setTransferReservation(null)}>
                                  لغو
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => cancelReservation(reservation.id)}
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-4 grid grid-cols-3 items-center">
            {/* Items per page selector - Left column */}
            <div className="flex items-center gap-2">
              <Label htmlFor="items-per-page" className="text-sm whitespace-nowrap">
                تعداد در صفحه:
              </Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(parseInt(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">{toPersianDigits("10")}</SelectItem>
                  <SelectItem value="20">{toPersianDigits("20")}</SelectItem>
                  <SelectItem value="50">{toPersianDigits("50")}</SelectItem>
                  <SelectItem value="100">{toPersianDigits("100")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pagination - Center column */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ChevronRight className="h-4 w-4" />
                  قبلی
                </Button>
                
                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = i + 1
                    if (totalPages <= 5) {
                      return (
                        <Button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                        >
                          {toPersianDigits(pageNumber.toString())}
                        </Button>
                      )
                    }
                    return null
                  })}
                </div>

                <Button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  بعدی
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results info - Right column */}
            <div className="flex justify-end">
              <div className="text-sm text-muted-foreground">
                {toPersianDigits(`${startIndex + 1}`)} تا {toPersianDigits(`${Math.min(endIndex, totalItems)}`)} از{" "}
                {toPersianDigits(totalItems.toString())} مورد
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// کامپوننت فرم ارسال پیام
function MessageForm({ onSend, isLoading }: { onSend: (message: string) => void; isLoading: boolean }) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      alert("لطفاً پیام را وارد کنید")
      return
    }
    onSend(message)
    setMessage("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="message" className="text-right block">
          متن پیام
        </Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="پیام خود را وارد کنید..."
          className="text-right min-h-[100px]"
          dir="rtl"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            در حال ارسال...
          </div>
        ) : (
          "ارسال پیام"
        )}
      </Button>
    </form>
  )
}

function SortableHeader({ title, sortKey, sortConfig, setSortConfig }: { 
  title: string; 
  sortKey: SortableKeys;
  sortConfig: { key: SortableKeys; direction: "ascending" | "descending" } | null;
  setSortConfig: React.Dispatch<React.SetStateAction<{ key: SortableKeys; direction: "ascending" | "descending" } | null>>;
}) {
  const direction = sortConfig?.key === sortKey ? sortConfig.direction : undefined

  const handleSort = () => {
    let newDirection: "ascending" | "descending" = "ascending"
    if (direction === "ascending") {
      newDirection = "descending"
    }
    setSortConfig({ key: sortKey, direction: newDirection })
  }

  return (
    <Button variant="ghost" onClick={handleSort} className="text-right p-0 hover:bg-transparent">
      {title}
      <ArrowUpDown className={`mr-0.5 h-4 w-4 ${!direction && "text-muted-foreground"}`} />
    </Button>
  )
}

function PatientFilter({ columnFilters, setColumnFilters }: {
  columnFilters: { status: string[]; callType: string[]; patientName: string; doctorName: string };
  setColumnFilters: React.Dispatch<React.SetStateAction<{ status: string[]; callType: string[]; patientName: string; doctorName: string }>>;
}) {
  const [patientName, setPatientName] = useState("")

  const handlePatientNameChange = (value: string) => {
    setPatientName(value)
    setColumnFilters((prev) => ({ ...prev, patientName: value }))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-2">
          <label className="text-sm font-medium">فیلتر بیمار:</label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => handlePatientNameChange(e.target.value)}
            placeholder="نام بیمار..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
            style={{ direction: 'rtl' }}
          />
          {columnFilters.patientName && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPatientName("")
                setColumnFilters((prev) => ({ ...prev, patientName: "" }))
              }}
              className="w-full"
            >
              حذف فیلتر
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function DoctorFilter({ columnFilters, setColumnFilters }: {
  columnFilters: { status: string[]; callType: string[]; patientName: string; doctorName: string };
  setColumnFilters: React.Dispatch<React.SetStateAction<{ status: string[]; callType: string[]; patientName: string; doctorName: string }>>;
}) {
  const [doctorName, setDoctorName] = useState("")

  const handleDoctorNameChange = (value: string) => {
    setDoctorName(value)
    setColumnFilters((prev) => ({ ...prev, doctorName: value }))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-2">
          <label className="text-sm font-medium">فیلتر پزشک:</label>
          <input
            type="text"
            value={doctorName}
            onChange={(e) => handleDoctorNameChange(e.target.value)}
            placeholder="نام پزشک..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
            style={{ direction: 'rtl' }}
          />
          {columnFilters.doctorName && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDoctorName("")
                setColumnFilters((prev) => ({ ...prev, doctorName: "" }))
              }}
              className="w-full"
            >
              حذف فیلتر
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
