"use client";

import __ from "@/lib/lang";
import CurrencyInput from "react-currency-input-field";
import { Input } from "../ui/input";

interface InputMoneyProps {
  name: string;
  value: number;
  onChange?: (e: any) => void;
  id?: string;
  placeholder?: string;
  required?: boolean;
  prefix?: string;
  error?: string | null;
  showErrorMessages?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  label?: string;
}
export default function InputMoney({
  name,
  label,
  prefix = "",
  value,
  showErrorMessages = true,
  required = false,
  onChange = () => {},
  id,
  placeholder,
  error,
  disabled,
  icon = null,
}: InputMoneyProps) {
  return (
    <div className="flex flex-col relative">
      {label && (
        <div className="mb-1">
          <label htmlFor={id} className="text-sm font-semibold">
            {__(label)}
            {required && <span className="text-red-600">*</span>}
          </label>
        </div>
      )}
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center">
            {icon}
          </div>
        )}
        <CurrencyInput
          id={id}
          type="text"
          autoComplete="off"
          name={name}
          value={value ?? 0}
          prefix={prefix}
          onFocus={(e: any) => {
            e.target.select();
          }}
          onValueChange={(value: any, name: any) => {
            if (value) {
              onChange({ target: { name, value } });
            } else {
              onChange({ target: { name, value: 0 } });
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          style={{ paddingLeft: icon ? "2.5rem" : "" }}
          className={`flex h-10 w-full rounded-md border border-input bg-transparent px-1 py-2  ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-right font-semibold text-base ${
            error ? "border-red-500" : ""
          }`}
        />
      </div>
      {error && showErrorMessages && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
