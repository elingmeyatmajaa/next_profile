"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { CommandList, CommandSeparator } from "cmdk";
import TextForm from "./text_form";
import HttpClient from "@/lib/http_client";
import { Search } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import __ from "@/lib/lang";

type Result = {
  value: string;
  label: string;
};
type ComboboxOption = {
  value: string;
  label: string;
};

export function Combobox({
  option,
  onChange,
  url,
  columns,
  label,
  error,
  id,
}: {
  option: ComboboxOption;
  onChange: any;
  url: string;
  id: string;
  label: string;
  error?: string[];
  columns: {
    label: string;
    value: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (value != "") {
      onChange(results.find((result: any) => result.value == value));
    }
  }, [value]);

  const [results, setResults] = useState([] as Result[]);

  useEffect(() => {
    async function getList() {
      const { data } = await HttpClient.GET(url, {
        search: query,
      });
      const exists = data.data.filter(
        (item: any) => item[columns.value] == option.value
      );
      if (!exists) {
        setResults([
          { value: option.value, label: option.label },
          ...data.data.map((item: any) => {
            return {
              value: item[columns.value].toString(),
              label: item[columns.label],
            };
          }),
        ]);
      } else {
        setResults([
          ...data.data.map((item: any) => {
            return {
              value: item[columns.value].toString(),
              label: item[columns.label],
            };
          }),
        ]);
      }
      if (!open) {
        setValue(option.value);
      }
    }
    if (query.length > 2) {
      getList();
    }
  }, [query]);

  useEffect(() => {
    setResults([
      {
        value: option?.value,
        label: option?.label,
      },
    ]);
  }, [option]);

  function renderResult() {
    if (value != "") {
      const result = results.find(
        (result: any) => result.value == value
      ) as any;
      if (!result) {
        return "Select ...";
      }
      return result.label ?? "";
    } else if (option.value != "") {
      return option.label;
    }
    return "Select ...";
  }
  return (
    <>
      <label htmlFor={id} className="text-sm mb-1">
        {__(label)}
        <span className="text-red-600">*</span>
      </label>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between"
        onClick={() => setOpen(!open)}>
        <div>{renderResult()}</div>
        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      {error &&
        error.map((item, index) => (
          <div key={index} className="text-red-500 text-xs">
            {item}
          </div>
        ))}
      {open && (
        <>
          <div className="mt-3   border rounded-lg w-full">
            <div className="flex items-center border-b px-3 border rounded-lg mb-2">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 " />
              <input
                type="text"
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {results.map((result: any, key: number) => (
              <div
                key={key}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50  w-full! hover:bg-blue-100 hover:text-blue-600",
                  value === result.value && "bg-blue-600 text-white"
                )}
                onClick={() => {
                  setValue(result.value);
                  setOpen(false);
                }}>
                <div className="flex justify-between text-left">
                  <div>{result.label}</div>
                </div>
              </div>
            ))}
          </div>
          {/* <div
            className={`${
              option.length > 6 && "h-60"
            } absolute z-40 border-2 border-gray-400  bg-white mt-1 w-full overflow-y-auto rounded-lg  pt-1`}>
            <div className="flex items-center border-b px-3  rounded-lg mb-2">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 " />
              <input
                type="text"
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <ul>
              {results.map((result: any, key: number) => (
                <li
                  key={key}
                  className="hover:bg-gray-600 hover:text-white border-b cursor-pointer px-3 py-1.5 text-base"
                  onClick={() => {
                    setValue(result.value);
                    setOpen(false);
                  }}>
                  {result.label} {result.desc ? " - " + result.desc : ""}
                </li>
              ))}
            </ul>
          </div> */}
        </>
      )}
    </>
  );
}
