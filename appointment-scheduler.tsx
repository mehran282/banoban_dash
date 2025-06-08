"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Settings, X, ArrowRight } from "lucide-react"
import { toPersianDigits } from "./utils/persian-utils"
import { Header } from "./components/header"
import { WeeklyScheduleGrid } from "./components/weekly-schedule-grid"

interface TimeSlot {
  id: string
  date: string
  time: string
  duration: number
  status: "available" | "booked" | "blocked"
  patientName?: string
  patientPhone?: string
  doctorId: string
  doctorName: string
}

interface Doctor {
  id: string
  name: string
  specialty: string
}

interface AppointmentSettings {
  slotDuration: number // دقیقه
  scheduleRange: number // روز
}

export default function AppointmentScheduler() {
  const [settings, setSettings] = useState<AppointmentSettings>({
    slotDuration: 12,
    scheduleRange: 30,
  })

  const [doctors] = useState<Doctor[]>([
    { id: "1", name: "دکتر احمد محمدی", specialty: "پزشک عمومی" },
    { id: "2", name: "دکتر مریم حسینی", specialty: "پزشک متخصص" },
    { id: "3", name: "دکتر حسن موسوی", specialty: "پزشک متخصص" },
  ])

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: "2024-01-15-09:00-1",
      date: "2024-01-15",
      time: "09:00",
      duration: 12,
      status: "booked",
      patientName: "علی احمدی",
      patientPhone: "09123456789",
      doctorId: "1",
      doctorName: "دکتر احمد محمدی",
    },
    {
      id: "2024-01-15-10:30-2",
      date: "2024-01-15",
      time: "10:30",
      duration: 12,
      status: "booked",
      patientName: "فاطمه کریمی",
      patientPhone: "09187654321",
      doctorId: "2",
      doctorName: "دکتر مریم حسینی",
    },
    {
      id: "2024-01-17-11:00-3",
      date: "2024-01-17",
      time: "11:00",
      duration: 12,
      status: "booked",
      patientName: "زهرا موسوی",
      patientPhone: "09112345678",
      doctorId: "3",
      doctorName: "دکتر حسن موسوی",
    },
    {
      id: "2024-01-15-14:00-1",
      date: "2024-01-15",
      time: "14:00",
      duration: 12,
      status: "available",
      doctorId: "1",
      doctorName: "دکتر احمد محمدی",
    },
  ])
  const [selectedDoctor, setSelectedDoctor] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [transferSlot, setTransferSlot] = useState<TimeSlot | null>(null)

  // تولید پارسل‌های زمانی برای یک روز
  const generateDaySlots = (date: string, doctorId: string, doctorName: string) => {
    const slots: TimeSlot[] = []
    const startHour = 8 // ساعت شروع کار
    const endHour = 18 // ساعت پایان کار
    const slotDuration = settings.slotDuration

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        slots.push({
          id: `${date}-${timeString}-${doctorId}`,
          date,
          time: timeString,
          duration: slotDuration,
          status: "available",
          doctorId,
          doctorName,
        })
      }
    }
    return slots
  }

  // تولید پارسل‌های زمانی برای بازه انتخاب شده
  const generateSchedule = async () => {
    if (!selectedDoctor) {
      alert("لطفاً پزشک را انتخاب کنید")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const doctor = doctors.find((d) => d.id === selectedDoctor)!
    const newSlots: TimeSlot[] = []

    for (let i = 0; i < settings.scheduleRange; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      const dateString = date.toISOString().split("T")[0]

      // فقط روزهای کاری (شنبه تا چهارشنبه)
      const dayOfWeek = date.getDay()
      if (dayOfWeek !== 5 && dayOfWeek !== 6) {
        // 5=جمعه، 6=شنبه در تقویم میلادی
        const daySlots = generateDaySlots(dateString, doctor.id, doctor.name)
        newSlots.push(...daySlots)
      }
    }

    // حفظ پارسل‌های رزرو شده قبلی
    const existingBookedSlots = timeSlots.filter((slot) => slot.status === "booked" && slot.doctorId === selectedDoctor)
    existingBookedSlots.forEach((bookedSlot) => {
      const matchingSlot = newSlots.find((slot) => slot.id === bookedSlot.id)
      if (matchingSlot) {
        matchingSlot.status = "booked"
        matchingSlot.patientName = bookedSlot.patientName
        matchingSlot.patientPhone = bookedSlot.patientPhone
      }
    })

    setTimeSlots(newSlots)
    setIsLoading(false)
  }

  // رزرو پارسل
  const bookSlot = async (slotId: string, patientName: string, patientPhone: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setTimeSlots(
      timeSlots.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              status: "booked" as const,
              patientName,
              patientPhone,
            }
          : slot,
      ),
    )
    setIsLoading(false)
  }

  // لغو رزرو
  const cancelBooking = async (slotId: string) => {
    if (confirm("آیا از لغو این نوبت اطمینان دارید؟")) {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setTimeSlots(
        timeSlots.map((slot) =>
          slot.id === slotId
            ? {
                ...slot,
                status: "available" as const,
                patientName: undefined,
                patientPhone: undefined,
              }
            : slot,
        ),
      )
      setIsLoading(false)
    }
  }

  // انتقال نوبت
  const transferAppointment = async (fromSlotId: string, toSlotId: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const fromSlot = timeSlots.find((slot) => slot.id === fromSlotId)
    if (!fromSlot) return

    setTimeSlots(
      timeSlots.map((slot) => {
        if (slot.id === fromSlotId) {
          return {
            ...slot,
            status: "available" as const,
            patientName: undefined,
            patientPhone: undefined,
          }
        }
        if (slot.id === toSlotId) {
          return {
            ...slot,
            status: "booked" as const,
            patientName: fromSlot.patientName,
            patientPhone: fromSlot.patientPhone,
          }
        }
        return slot
      }),
    )

    setTransferSlot(null)
    setIsLoading(false)
  }

  // تغییر وضعیت پارسل (فعال/غیرفعال)
  const toggleSlotStatus = async (slotId: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))

    // اگر پارسل وجود ندارد، آن را ایجاد کن
    const existingSlot = timeSlots.find((slot) => slot.id === slotId)
    if (!existingSlot) {
      // استخراج اطلاعات از slotId
      const [date, time, doctorId] = slotId.split("-")
      const doctor = doctors.find((d) => d.id === doctorId)

      if (doctor) {
        const newSlot: TimeSlot = {
          id: slotId,
          date,
          time,
          duration: settings.slotDuration,
          status: "available",
          doctorId,
          doctorName: doctor.name,
        }
        setTimeSlots([...timeSlots, newSlot])
      }
    } else {
      setTimeSlots(
        timeSlots.map((slot) => {
          if (slot.id === slotId && slot.status !== "booked") {
            return {
              ...slot,
              status: slot.status === "available" ? "blocked" : ("available" as const),
            }
          }
          return slot
        }),
      )
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="md:mr-80">
        <div className="max-w-7xl mx-auto p-6 space-y-6 font-vazir" dir="rtl">
          {/* Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right flex items-center gap-2">
                <Settings className="h-5 w-5" />
                تنظیمات نوبت‌دهی
              </CardTitle>
              <CardDescription className="text-right">تنظیمات عمومی سیستم نوبت‌دهی</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-right block">مدت هر پارسل (دقیقه)</Label>
                  <Input
                    type="number"
                    value={settings.slotDuration}
                    onChange={(e) => setSettings({ ...settings, slotDuration: Number(e.target.value) })}
                    className="text-right"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-right block">بازه زمانی برنامه (روز)</Label>
                  <Input
                    type="number"
                    value={settings.scheduleRange}
                    onChange={(e) => setSettings({ ...settings, scheduleRange: Number(e.target.value) })}
                    className="text-right"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-right block">انتخاب پزشک</Label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="پزشک را انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4">
                <Button onClick={generateSchedule} disabled={isLoading || !selectedDoctor}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      در حال تولید برنامه...
                    </div>
                  ) : (
                    "تولید برنامه زمانی"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Display */}
          {selectedDoctor && (
            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  برنامه نوبت‌دهی
                </CardTitle>
                <CardDescription className="text-right">
                  برنامه نوبت‌دهی {doctors.find((d) => d.id === selectedDoctor)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WeeklyScheduleGrid
                  timeSlots={timeSlots}
                  selectedDoctor={selectedDoctor}
                  settings={settings}
                  onSlotToggle={toggleSlotStatus}
                  onSlotBook={bookSlot}
                  onSlotCancel={cancelBooking}
                  onSlotTransfer={setTransferSlot}
                  transferSlot={transferSlot}
                  onTransferComplete={transferAppointment}
                  isLoading={isLoading}
                />

                {/* Transfer Mode Indicator */}
                {transferSlot && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-5 w-5 text-blue-600" />
                        <span className="text-blue-800">
                          در حال انتقال نوبت {toPersianDigits(transferSlot.time)} - روی پارسل مقصد کلیک کنید
                        </span>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setTransferSlot(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
