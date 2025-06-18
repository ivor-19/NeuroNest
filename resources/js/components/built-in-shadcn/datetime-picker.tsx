"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateTimePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  description?: string
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date and time",
  label,
  description,
}: DateTimePickerProps) {
  const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined)
  const [time, setTime] = useState(value ? format(new Date(value), "HH:mm") : "09:00")
  const [open, setOpen] = useState(false)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const [hours, minutes] = time.split(":")
      selectedDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
      setDate(selectedDate)

      // Format as datetime-local string
      const formattedDateTime = format(selectedDate, "yyyy-MM-dd'T'HH:mm")
      onChange?.(formattedDateTime)
    }
  }

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)
    if (date) {
      const [hours, minutes] = newTime.split(":")
      const newDate = new Date(date)
      newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
      setDate(newDate)

      // Format as datetime-local string
      const formattedDateTime = format(newDate, "yyyy-MM-dd'T'HH:mm")
      onChange?.(formattedDateTime)
    }
  }

  const clearDateTime = () => {
    setDate(undefined)
    setTime("09:00")
    onChange?.("")
    setOpen(false)
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP 'at' HH:mm") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 space-y-3">
            <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
            <div className="flex items-center gap-2 px-3">
              <Clock className="h-4 w-4" />
              <Input type="time" value={time} onChange={(e) => handleTimeChange(e.target.value)} className="w-auto" />
            </div>
            <div className="flex gap-2 px-3">
              <Button variant="outline" size="sm" onClick={clearDateTime} className="flex-1">
                Clear
              </Button>
              <Button size="sm" onClick={() => setOpen(false)} className="flex-1">
                Done
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}
