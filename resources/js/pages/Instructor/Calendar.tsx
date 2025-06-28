"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  isWithinInterval,
} from "date-fns"
import { ChevronLeft, ChevronRight, CalendarIcon, Clock, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BreadcrumbItem } from "@/types"
import { Head } from "@inertiajs/react"
import HeaderLayout from "@/layouts/header-layout"

interface Event {
  id: string
  title: string
  description: string
  date: Date
  time: string
  type: "schedule" | "deadline"
  priority: "low" | "medium" | "high"
}

interface EventProps {
  eventsData: Event[]
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Calendar',
    href: 'admin/calendar',
  },
];

export default function Calendar({eventsData} : EventProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>(() => {
    return eventsData.map(event => ({
      ...event,
      date: new Date(event.date) // Convert string date to Date object
    }))
  })
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "schedule" as "schedule" | "deadline",
    priority: "low" as "low" | "medium" | "high",
  })

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeIcon = (type: string) => {
    return type === "deadline" ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />
  }

  const getEventsForWeek = (date: Date) => {
    const weekStart = startOfWeek(date)
    const weekEnd = endOfWeek(date)
    return events
      .filter((event) => isWithinInterval(event.date, { start: weekStart, end: weekEnd }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  const getEventsForMonth = (date: Date) => {
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)
    return events
      .filter((event) => isWithinInterval(event.date, { start: monthStart, end: monthEnd }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  const getEventsForYear = (date: Date) => {
    const yearStart = startOfYear(date)
    const yearEnd = endOfYear(date)
    return events
      .filter((event) => isWithinInterval(event.date, { start: yearStart, end: yearEnd }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }


  return (
     <HeaderLayout>
      <Head title={'Calendar'}/>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Calendar Scheduler</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  {format(currentDate, "MMMM yyyy")}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day) => {
                  const dayEvents = getEventsForDate(day)
                  const isSelected = selectedDate && isSameDay(day, selectedDate)
                  const isCurrentMonth = isSameMonth(day, currentDate)

                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "min-h-[80px] p-1 border rounded-lg cursor-pointer transition-colors",
                        isCurrentMonth ? "bg-background" : "bg-muted/50",
                        isSelected && "ring-2 ring-primary",
                        isToday(day) && "bg-primary/10 border-primary",
                      )}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div
                        className={cn(
                          "text-sm font-medium mb-1",
                          !isCurrentMonth && "text-muted-foreground",
                          isToday(day) && "text-primary font-bold",
                        )}
                      >
                        {format(day, "d")}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "text-xs p-1 rounded flex items-center gap-1 truncate",
                              event.type === "deadline" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800",
                            )}
                          >
                            {getTypeIcon(event.type)}
                            <span className="truncate">{event.title}</span>
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</div>
                        )}
                       
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="space-y-3">
                    {getEventsForDate(selectedDate).length === 0 ? (
                      <p className="text-muted-foreground text-sm">No events for this date</p>
                    ) : (
                      getEventsForDate(selectedDate)
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((event) => (
                          <div key={event.id} className="p-3 border rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{event.title}</h4>
                              <div className="flex items-center gap-2">
                                <Badge variant={event.type === "deadline" ? "destructive" : "default"}>
                                  {event.type}
                                </Badge>
                                <div className={cn("w-2 h-2 rounded-full", getPriorityColor(event.priority))} />
                                
                              </div>
                            </div>
                            {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}
                            {event.time && <p className="text-sm font-medium">{event.time}</p>}
                            
                          </div>
                        ))
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Click on a date to view events</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scheduled Events</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="week" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="week">This Week</TabsTrigger>
                    <TabsTrigger value="month">This Month</TabsTrigger>
                    <TabsTrigger value="year">This Year</TabsTrigger>
                  </TabsList>

                  <TabsContent value="week" className="space-y-3 mt-4">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      {format(startOfWeek(currentDate), "MMM d")} - {format(endOfWeek(currentDate), "MMM d, yyyy")}
                    </div>
                    {getEventsForWeek(currentDate).filter((event) => event.type === "schedule").length === 0 ? (
                      <p className="text-muted-foreground text-sm">No scheduled events this week</p>
                    ) : (
                      getEventsForWeek(currentDate)
                        .filter((event) => event.type === "schedule")
                        .map((event) => (
                          <div key={event.id} className="flex items-center gap-3 p-2 border rounded-lg">
                            {getTypeIcon(event.type)}
                            <div className="flex-1">
                              <p className="font-medium text-sm">{event.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(event.date, "EEE, MMM d")} {event.time && `at ${event.time}`}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge
                                variant={event.type === "deadline" ? "destructive" : "secondary"}
                                className="text-xs"
                              >
                                {event.type}
                              </Badge>
                              <div className={cn("w-2 h-2 rounded-full", getPriorityColor(event.priority))} />
                            </div>
                          </div>
                        ))
                    )}
                  </TabsContent>

                  <TabsContent value="month" className="space-y-3 mt-4">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      {format(currentDate, "MMMM yyyy")}
                    </div>
                    {getEventsForMonth(currentDate).filter((event) => event.type === "schedule").length === 0 ? (
                      <p className="text-muted-foreground text-sm">No scheduled events this month</p>
                    ) : (
                      getEventsForMonth(currentDate)
                        .filter((event) => event.type === "schedule")
                        .map((event) => (
                          <div key={event.id} className="flex items-center gap-3 p-2 border rounded-lg">
                            {getTypeIcon(event.type)}
                            <div className="flex-1">
                              <p className="font-medium text-sm">{event.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(event.date, "MMM d")} {event.time && `at ${event.time}`}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge
                                variant={event.type === "deadline" ? "destructive" : "secondary"}
                                className="text-xs"
                              >
                                {event.type}
                              </Badge>
                              <div className={cn("w-2 h-2 rounded-full", getPriorityColor(event.priority))} />
                            </div>
                          </div>
                        ))
                    )}
                  </TabsContent>

                  <TabsContent value="year" className="space-y-3 mt-4">
                    <div className="text-sm font-medium text-muted-foreground mb-2">{format(currentDate, "yyyy")}</div>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {getEventsForYear(currentDate).filter((event) => event.type === "schedule").length === 0 ? (
                        <p className="text-muted-foreground text-sm">No scheduled events this year</p>
                      ) : (
                        getEventsForYear(currentDate)
                          .filter((event) => event.type === "schedule")
                          .map((event) => (
                            <div key={event.id} className="flex items-center gap-3 p-2 border rounded-lg">
                              {getTypeIcon(event.type)}
                              <div className="flex-1">
                                <p className="font-medium text-sm">{event.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(event.date, "MMM d, yyyy")} {event.time && `at ${event.time}`}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Badge
                                  variant={event.type === "deadline" ? "destructive" : "secondary"}
                                  className="text-xs"
                                >
                                  {event.type}
                                </Badge>
                                <div className={cn("w-2 h-2 rounded-full", getPriorityColor(event.priority))} />
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events
                    .filter((event) => event.type === "deadline" && event.date >= new Date())
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .slice(0, 5)
                    .map((event) => (
                      <div key={event.id} className="flex items-center gap-3 p-2 border rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(event.date, "MMM d")} {event.time && `at ${event.time}`}
                          </p>
                        </div>
                        <div className={cn("w-2 h-2 rounded-full", getPriorityColor(event.priority))} />
                      </div>
                    ))}
                  {events.filter((event) => event.type === "deadline" && event.date >= new Date()).length === 0 && (
                    <p className="text-muted-foreground text-sm">No upcoming deadlines</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
     </HeaderLayout>
  )
}
