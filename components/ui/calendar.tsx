"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { cn } from "@/lib/utils"

type CalendarProps = React.ComponentPropsWithoutRef<typeof DayPicker>

function Calendar({ className, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays
      className={cn(
        "p-3 rounded-md border bg-white text-black shadow dark:bg-gray-900 dark:text-white",
        className
      )}
      {...props}
    />
  )
}

export { Calendar }
