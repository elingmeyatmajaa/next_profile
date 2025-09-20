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
import { IconCalendar } from "@tabler/icons-react";

interface InputDateProps {
  name: string;
  value: string;
  onChange: (e: any) => void;
  id?: string;
  placeholder?: string;
  labelFrom?: string;
  labelTo?: string;
  error?: string | null;
  withTime?: boolean;
}
export default function InputDualDate({
  name,
  placeholder,
  value,
  labelFrom = __("From"),
  labelTo = __('To'),
  onChange,
  error,
}: InputDateProps) {
  const [date, setDate] = useState<any>();
  useEffect(() => {
    function trimTime() {
      if (value) {
        let [startTime, endTime] = value
          .split(" ")
          .map((time) => time.trim());
        setStart(startTime);
        setEnd(endTime);
      }
    }

    trimTime();
    try {
      setDate(value != "" ? new Date(value) : null);
    } catch (error) {
    }
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

  const [start, setStart] = useState("00:00");
  const [end, setEnd] = useState("00:00");


  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  return (
    <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="">
        {labelFrom && <div className="mb-2">{labelFrom}</div>}
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          onClick={() => setOpenFrom(!openFrom)}>
          <IconCalendar className="mr-2 h-4 w-4" />
          {renderDate()}
        </Button>
        {openFrom && (
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
        )}

        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>

      <div className="">
        {labelTo && <div className="mb-2">{labelTo}</div>}
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          onClick={() => setOpenTo(!openTo)}>
          <IconCalendar className="mr-2 h-4 w-4" />
          {renderDate()}
        </Button>
        {openTo && (
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
        )}

        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
