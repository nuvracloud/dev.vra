"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateRangePickerProps {
  dateRange: DateRange
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>
  className?: string
}

export function DateRangePicker({ dateRange, setDateRange, className }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handlePresetChange = (preset: string) => {
    const today = new Date()
    const from = new Date()

    switch (preset) {
      case "last7days":
        from.setDate(today.getDate() - 7)
        break
      case "last30days":
        from.setDate(today.getDate() - 30)
        break
      case "last90days":
        from.setDate(today.getDate() - 90)
        break
      case "thisMonth":
        from.setDate(1)
        break
      case "lastMonth":
        from.setMonth(today.getMonth() - 1)
        from.setDate(1)
        const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
        today.setDate(lastDayOfLastMonth.getDate())
        today.setMonth(lastDayOfLastMonth.getMonth())
        break
      case "thisYear":
        from.setMonth(0)
        from.setDate(1)
        break
      default:
        from.setDate(today.getDate() - 30)
    }

    setDateRange({ from, to: today })
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[300px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                  {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                </>
              ) : (
                format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Período Predefinido</h4>
              <Select onValueChange={handlePresetChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="last30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="last90days">Últimos 90 dias</SelectItem>
                  <SelectItem value="thisMonth">Este mês</SelectItem>
                  <SelectItem value="lastMonth">Mês passado</SelectItem>
                  <SelectItem value="thisYear">Este ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(range) => {
              setDateRange(range || { from: new Date(), to: new Date() })
              if (range?.from && range?.to) {
                setIsOpen(false)
              }
            }}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

