"use client";

import __ from "@/lib/lang";
import React from "react";

interface SelectOption {
  value: string;
  label: string;
  desc?: string;
}

interface SelectProps {
  options: SelectOption[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  label?: string;
  value: any;
  error?: string[];
  className?: string;
  required?: boolean;
}

const SelectForm: React.FC<SelectProps> = ({
  options,
  onChange,
  name,
  value,
  error,
  label,
  className,
  required,
}) => {
  return (
    <div className="relative w-full inline-block text-left mb-3">
      {label && (
        <div className="text-sm mb-1 font-semibold">
          {label}
          {required && <span className="text-red-500">*</span>}
        </div>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`${className} ${
          error && "border-red-500"
        } + w-full appearance-none bg-white border rounded-md mt-1 py-2 px-3 text-sm leading-5 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer`}>
        <option value="">{`${__("Select")}`}</option>
        {options.map((option, key) => (
          <option
            className="rounded-md cursor-pointer h-12"
            key={key}
            value={option.value}>
            {option.desc ? `${option.label} ~ (${option.desc})` : option.label}
          </option>
        ))}
      </select>
      {error &&
        error.map((item, index) => (
          <div key={index} className="text-red-500 text-xs">
            {item}
          </div>
        ))}
    </div>
  );
};

export default SelectForm;
