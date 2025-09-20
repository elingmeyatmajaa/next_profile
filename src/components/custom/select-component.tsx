import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Data = {
  label: string;
  value: number;
};

type SelectComponentProps = {
  value: number;
  onChange: (value: string) => void;
  data: Data[];
  title?: string;
};
export function SelectComponent({
  value,
  onChange,
  title = "Select",
  data,
}: SelectComponentProps) {
  return (
    <Select onValueChange={(e) => onChange(e)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={title} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel>Fruits</SelectLabel> */}
          {data.map((item: any, index: number) => (
            <SelectItem key={index} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
