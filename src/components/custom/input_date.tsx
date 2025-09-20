"use client";

import { Input } from "../ui/input";

import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import __ from "@/lib/lang";
import moment from "moment";
import { ca } from "date-fns/locale";
import { CalendarDays } from "lucide-react";

interface InputDateProps {
  name: string;
  value: string;
  onChange: (e: any) => void;
  id?: string;
  placeholder?: string;
  label?: string;
  error?: string | null;
  withTime?: boolean;
  required?: boolean;
}
export default function InputDate({
  id,
  name,
  placeholder,
  value,
  label,
  onChange,
  error,
  required
}: InputDateProps) {
  const [date, setDate] = useState<any>();
  useEffect(() => {
    try {
      setDate(value != "" ? new Date(value) : null);
    } catch (error) { }
  }, [value]);

  const renderDate = () => {
    if (date == null) {
      return <span>{placeholder ?? __("Pick a date")}</span>;
    }
    try {
      return <span>{format(date!, "dd-MM-yyyy")}</span>;
    } catch (error) {
      return <span>{placeholder ?? __("Pick a date")}</span>;
    }
  };

  const [open, setOpen] = useState(false);

  return (
    <div className="mb-3">
      {label && (
        <div className="mb-1">
          <label htmlFor={id} className="text-sm font-semibold">
            {__(label)}
            {required && <span className="text-red-600">*</span>}
          </label>
        </div>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            onClick={() => setOpen(!open)}>
            <CalendarDays className="mr-2 h-4 w-4" />
            {renderDate()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(_date: any) => {
              setDate(_date);
              onChange({
                target: {
                  name,
                  value: _date != null ? format(_date, "yyyy-MM-dd") : "",
                },
              });
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>


      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
