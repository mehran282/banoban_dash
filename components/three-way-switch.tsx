"use client"
import { Button } from "@/components/ui/button"

interface ThreeWaySwitchProps {
  value: "inPerson" | "online"
  onChange: (value: "inPerson" | "online") => void
}

export function ThreeWaySwitch({ value, onChange }: ThreeWaySwitchProps) {
  const options = [
    { key: "inPerson", label: "حضوری" },
    { key: "online", label: "آنلاین" },
  ] as const

  return (
    <div className="flex rounded-lg border-2 p-1 bg-muted/30" dir="rtl">
      {options.map((option) => (
        <Button
          key={option.key}
          type="button"
          variant={value === option.key ? "default" : "ghost"}
          size="sm"
          className={`flex-1 text-sm transition-all duration-200 ${
            value === option.key
              ? "bg-primary text-primary-foreground shadow-md border-2 border-primary/20 font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
          onClick={() => onChange(option.key)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
