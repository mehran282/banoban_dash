"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Phone } from "lucide-react"
import { toPersianDigits } from "../utils/persian-utils"

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

interface AppointmentSettings {
  slotDuration: number
  scheduleRange: number
}

interface WeeklyScheduleGridProps {
  timeSlots: TimeSlot[]
  selectedDoctor: string
  settings: AppointmentSettings
  onSlotToggle: (slotId: string) => void
  onSlotBook: (slotId: string, name: string, phone: string) => void
  onSlotCancel: (slotId: string) => void
  onSlotTransfer: (slot: TimeSlot) => void
  transferSlot: TimeSlot | null
  onTransferComplete: (fromSlotId: string, toSlotId: string) => void
  isLoading: boolean
}

export function WeeklyScheduleGrid({
  timeSlots,
  selectedDoctor,
  settings,
  onSlotToggle,
  onSlotBook,
  onSlotCancel,
  onSlotTransfer,
  transferSlot,
  onTransferComplete,
  isLoading,
}: WeeklyScheduleGridProps) {
  const [showWorkingHours, setShowWorkingHours] = useState(true)
  const [showNonWorkingHours, setShowNonWorkingHours] = useState(false)

  // تولید هفته جاری
  const getWeekDates = () => {
    const today = new Date()
    const currentDay = today.getDay()
    const startOfWeek = new Date(today)

    // شروع از شنبه (روز 6 در تقویم میلادی)
    const daysToSaturday = currentDay === 6 ? 0 : currentDay === 0 ? 1 : 7 - currentDay + 6
    startOfWeek.setDate(today.getDate() - daysToSaturday)

    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDates.push(date)
    }
    return weekDates
  }

  // تولید ساعات مطابق تصویر
  const getTimeSlots = () => {
    const times = []

    // ساعات صبح: 05:00 تا 12:00
    for (let hour = 5; hour <= 11; hour++) {
      for (let minute = 0; minute < 60; minute += settings.slotDuration) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        times.push({ time: timeString, isWorkingHour: hour >= 8 && hour < 12 })
      }
    }

    // ساعت 12:00
    times.push({ time: "12:00", isWorkingHour: false })

    // ساعات عصر: 13:00 تا 23:00
    for (let hour = 13; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += settings.slotDuration) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        times.push({ time: timeString, isWorkingHour: hour >= 13 && hour < 18 })
      }
    }

    return times
  }

  const weekDates = getWeekDates()
  const timeSlots_list = getTimeSlots()

  // نام روزهای هفته به فارسی (شروع از شنبه)
  const dayNames = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"]

  // پیدا کردن پارسل برای تاریخ و ساعت مشخص
  const findSlot = (date: string, time: string) => {
    return timeSlots.find((slot) => slot.date === date && slot.time === time && slot.doctorId === selectedDoctor)
  }

  // فیلتر ساعات بر اساس انتخاب کاربر
  const filteredTimeSlots = timeSlots_list.filter((timeSlot) => {
    if (timeSlot.isWorkingHour && showWorkingHours) return true
    if (!timeSlot.isWorkingHour && showNonWorkingHours) return true
    return false
  })

  // رنگ‌بندی بر اساس وضعیت
  const getSlotColor = (slot: TimeSlot | undefined, isWorkingHour: boolean) => {
    if (!slot) {
      return isWorkingHour
        ? "bg-white border-gray-300 hover:bg-gray-50 cursor-pointer"
        : "bg-gray-50 border-gray-200 cursor-not-allowed"
    }

    switch (slot.status) {
      case "available":
        return "bg-green-50 border-green-300 hover:bg-green-100 cursor-pointer"
      case "booked":
        return "bg-blue-50 border-blue-300 cursor-pointer"
      case "blocked":
        return "bg-red-50 border-red-300 hover:bg-red-100 cursor-pointer"
      default:
        return "bg-white border-gray-300 cursor-pointer"
    }
  }

  // کلیک روی پارسل
  const handleSlotClick = (date: string, time: string, isWorkingHour: boolean) => {
    if (!isWorkingHour || isLoading) return

    const slot = findSlot(date, time)

    // اگر در حالت انتقال هستیم
    if (transferSlot) {
      if (!slot || slot.status === "available") {
        const slotId = slot?.id || `${date}-${time}-${selectedDoctor}`
        onTransferComplete(transferSlot.id, slotId)
      }
      return
    }

    // اگر پارسل وجود ندارد، آن را ایجاد کن
    if (!slot) {
      const newSlotId = `${date}-${time}-${selectedDoctor}`
      onSlotToggle(newSlotId)
      return
    }

    // اگر پارسل رزرو شده، کاری نکن
    if (slot.status === "booked") return

    // تغییر وضعیت فعال/غیرفعال
    onSlotToggle(slot.id)
  }

  return (
    <div className="space-y-4">
      {/* Header with checkboxes */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">برنامه هفتگی</h3>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Checkbox id="working-hours" checked={showWorkingHours} onCheckedChange={setShowWorkingHours} />
            <Label htmlFor="working-hours" className="text-sm">
              کاری
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="non-working-hours" checked={showNonWorkingHours} onCheckedChange={setShowNonWorkingHours} />
            <Label htmlFor="non-working-hours" className="text-sm">
              غیرکاری
            </Label>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-8 bg-gray-100">
          <div className="p-3 text-center font-medium border-l border-gray-300"></div>
          {dayNames.map((dayName, index) => (
            <div key={index} className="p-3 text-center font-medium border-l border-gray-300 last:border-l-0">
              {dayName}
            </div>
          ))}
        </div>

        {/* Time Rows */}
        {filteredTimeSlots.map((timeSlot, timeIndex) => (
          <div key={timeSlot.time} className="grid grid-cols-8 border-t border-gray-300">
            {/* Time Column */}
            <div className="p-3 text-center font-medium bg-gray-50 border-l border-gray-300 text-sm">
              {toPersianDigits(timeSlot.time)}
            </div>

            {/* Day Columns */}
            {weekDates.map((date, dayIndex) => {
              const dateString = date.toISOString().split("T")[0]
              const slot = findSlot(dateString, timeSlot.time)

              return (
                <div
                  key={`${dateString}-${timeSlot.time}`}
                  className={`p-2 border-l border-gray-300 last:border-l-0 min-h-[50px] transition-all ${getSlotColor(
                    slot,
                    timeSlot.isWorkingHour,
                  )}`}
                  onClick={() => handleSlotClick(dateString, timeSlot.time, timeSlot.isWorkingHour)}
                >
                  {slot && (
                    <div className="space-y-1">
                      {slot.status === "booked" && slot.patientName && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs">
                            <User className="h-3 w-3" />
                            <span className="truncate">{slot.patientName}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Phone className="h-3 w-3" />
                            <span>{toPersianDigits(slot.patientPhone || "")}</span>
                          </div>
                        </div>
                      )}

                      {/* Status indicator */}
                      {slot.status === "available" && <div className="w-full h-2 bg-green-400 rounded"></div>}
                      {slot.status === "blocked" && <div className="w-full h-2 bg-red-400 rounded"></div>}
                      {slot.status === "booked" && <div className="w-full h-2 bg-blue-400 rounded"></div>}

                      {/* Action Buttons */}
                      {timeSlot.isWorkingHour && (
                        <div className="flex gap-1 justify-center">
                          {slot.status === "available" && !transferSlot && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs h-5 px-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  رزرو
                                </Button>
                              </DialogTrigger>
                              <DialogContent dir="rtl">
                                <DialogHeader>
                                  <DialogTitle className="text-right">رزرو نوبت</DialogTitle>
                                  <DialogDescription className="text-right">
                                    رزرو نوبت برای ساعت {toPersianDigits(slot.time)}
                                  </DialogDescription>
                                </DialogHeader>
                                <BookingForm
                                  onBook={(name, phone) => onSlotBook(slot.id, name, phone)}
                                  isLoading={isLoading}
                                />
                              </DialogContent>
                            </Dialog>
                          )}

                          {slot.status === "booked" && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="destructive"
                                className="text-xs h-5 px-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onSlotCancel(slot.id)
                                }}
                                disabled={isLoading}
                              >
                                لغو
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-5 px-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onSlotTransfer(slot)
                                }}
                                disabled={isLoading}
                              >
                                انتقال
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-2 bg-green-400 rounded"></div>
          <span>آزاد</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-2 bg-blue-400 rounded"></div>
          <span>رزرو شده</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-2 bg-red-400 rounded"></div>
          <span>غیرفعال</span>
        </div>
      </div>
    </div>
  )
}

// کامپوننت فرم رزرو
function BookingForm({
  onBook,
  isLoading,
}: {
  onBook: (name: string, phone: string) => void
  isLoading: boolean
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) {
      alert("لطفاً تمام فیلدها را پر کنید")
      return
    }
    onBook(formData.name, formData.phone)
    setFormData({ name: "", phone: "" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="patientName" className="text-right block">
          نام بیمار
        </Label>
        <Input
          id="patientName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="نام و نام خانوادگی"
          className="text-right"
          dir="rtl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="patientPhone" className="text-right block">
          شماره تماس
        </Label>
        <Input
          id="patientPhone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="۰۹۱۲۳۴۵۶۷۸۹"
          className="text-right"
          dir="rtl"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            در حال رزرو...
          </div>
        ) : (
          "تأیید رزرو"
        )}
      </Button>
    </form>
  )
}
