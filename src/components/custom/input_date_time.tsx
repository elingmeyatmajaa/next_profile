"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import moment from "moment";
import "moment/locale/id";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DateTimePickerProps {
  value?: string;
  onChange?: (dateString: string) => void;
  placeholder?: string;
}

export default function DateTimePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal dan waktu",
}: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<
    Date | undefined
  >(value ? moment(value, "YYYY-MM-DD HH:mm:ss").toDate() : undefined);

  React.useEffect(() => {
    if (value) {
      setSelectedDateTime(moment(value, "YYYY-MM-DD HH:mm:ss").toDate());
    } else {
      setSelectedDateTime(undefined);
    }
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const currentTime = selectedDateTime || new Date();
      selectedDate.setHours(currentTime.getHours());
      selectedDate.setMinutes(currentTime.getMinutes());
      setSelectedDateTime(selectedDate);
      triggerOnChange(selectedDate);
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const timeString = event.target.value;
    if (timeString && selectedDateTime) {
      const [hours, minutes] = timeString.split(":");
      const newDateTime = new Date(selectedDateTime);
      newDateTime.setHours(parseInt(hours, 10));
      newDateTime.setMinutes(parseInt(minutes, 10));
      setSelectedDateTime(newDateTime);
      triggerOnChange(newDateTime);
    }
  };

  const triggerOnChange = (date: Date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
    onChange?.(formattedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDateTime && "text-muted-foreground"
          )}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDateTime ? (
            moment(selectedDateTime).locale("id").format("DD MMMM YYYY HH:mm")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDateTime}
          onSelect={handleDateSelect}
          locale={id}
        />
        <div className="p-3 border-t border-border">
          <Input
            type="time"
            value={selectedDateTime ? format(selectedDateTime, "HH:mm") : ""}
            onChange={handleTimeChange}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
