// import __ from "@/lib/lang";
// import { IconChevronDown, IconX } from "@tabler/icons-react";
// import { useEffect, useState } from "react";
// type SelectOption = {
//   value: string | number | undefined;
//   label: string;
//   desc?: string;
// };
// export default function SelectSearch({
//   value,
//   show,
//   onChange,
//   onSearch = () => { },
//   label,
//   error,
//   options,
//   clasName = "border",
//   placeholder,
// }: {
//   value?: string | number;
//   label?: string;
//   clasName?: string;
//   show?: boolean;
//   error?: string[];
//   placeholder?: string;
//   options: SelectOption[];
//   onSearch?: (event: any) => any;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }) {
//   const [val, setVal] = useState(`` as string | number | undefined);
//   const [open, setOpen] = useState(false);
//   const [isSearch, setIsSearch] = useState(true);
//   useEffect(() => {
//     if (value && isSearch) {
//       const result = options.filter(
//         (option) => option.value == value || option.label == value
//       );
//       setVal(result?.[0]?.label);
//     }
//   }, [options?.[0]?.label]);

//   // useEffect(() => {
//   //   console.log(show, "show");
//   //   if (!show) {
//   //     setIsSearch(true);
//   //     // console.log(show, 'show');
//   //   }
//   //   console.log(isSearch, "isSearch");
//   // }, []);

//   return (
//     <div className="relative mb-3 -mt-1">
//       {label && (
//         <label className="text-sm">
//           {__(label)}
//           <span className="text-gray-600">*</span>
//         </label>
//       )}
//       <div className="flex">
//         <input
//           className={`${clasName} ${error && "border-red-500"
//             } flex mt-1 h-10 w-full rounded-l-lg px-3 py-2 text-sm`}
//           value={val ?? ''}
//           placeholder={placeholder}
//           autoComplete="new-password"
//           onChange={(e) => {
//             onSearch(e.target.value);
//             setVal(e.target.value);
//             setOpen(true);
//             setIsSearch(false);
//           }}
//         />
//         <div
//           className={`${clasName} ${error && "border-red-500"
//             } h-10 mt-1 rounded-r-lg flex items-center pl-1 pr-1`}
//           onClick={() => {
//             setOpen(false);
//             onSearch("");
//             setVal("");
//           }}>
//           <IconX className={`h-4 w-4 ml-0.5 mt-0.5 hover:cursor-pointer`} />
//         </div>
//       </div>

//       {error &&
//         error.map((item, index) => (
//           <div key={index} className="text-red-500 mt-1 text-xs">
//             {item}
//           </div>
//         ))}
//       {open && options.length != 0 && (
//         <div
//           className={`${options.length > 6 && "h-60"
//             } absolute z-40 border-2 border-gray-400  bg-white mt-1 w-full  overflow-y-auto  rounded-lg  pt-1`}>
//           <ul>
//             {options.map((option: any, key: number) => (
//               <li
//                 key={key}
//                 className="hover:bg-gray-600 hover:text-white border-b cursor-pointer px-3 py-1.5 text-base"
//                 onClick={() => {
//                   setVal(option.label);
//                   setIsSearch(true);
//                   onChange(option);
//                   setOpen(false);
//                 }}>
//                 {option.label} {option.desc ? " - " + option.desc : ""}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {open && options.length < 1 && (
//         <div
//           className={`${options.length > 6 && "h-60"
//             } absolute border-gray-600 border-2 z-10 bg-white mt-1 w-full  overflow-y-auto  rounded-lg  pt-1`}>
//           <ul>
//             <li
//               className="hover:bg-gray-600 hover:text-white text-gray-600 italic cursor-pointer px-3 py-1.5 text-base"
//               onClick={() => {
//                 setOpen(false);
//               }}>
//               data tidak ditemukan
//             </li>
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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

interface Option {
  value: string;
  label: string;
}

interface SelectSearchProps {
  options?: Option[];
  placeholder?: string;
  value: string | undefined;
  onChange: (value: string) => void;
}

export default function SelectSearch({
  options = [],
  placeholder = "Select an item...",
  value,
  onChange,
}: SelectSearchProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      onChange(currentValue === value ? "" : currentValue);
      setOpen(false);
    },
    [onChange, value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className=" justify-between">
          {value
            ? options.find((option) => option.value === value)?.label ??
              placeholder
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={handleSelect}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
