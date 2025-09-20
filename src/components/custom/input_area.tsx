"use client";

import __ from "@/lib/lang";
import { Textarea } from "../ui/textarea";

interface InputAreaProps {
  name: string | undefined;
  value: string | undefined;

  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  id?: string;
  placeholder?: string;
  error?: string | null;
  rows?: number;
  disabled?: boolean;
  required: boolean;
}
export default function InputArea({
  name,
  required,
  value,
  onChange,
  label,
  id,
  placeholder,
  error,
  rows = 3,
  disabled = false,
}: InputAreaProps) {
  return (
    <>
      {label && (
        <div className="text-sm  mb-1">
          {__(label)} {required && <span className="text-red-600">*</span>}
        </div>
      )}
      <Textarea
        id={id}
        className={"" + (error ? "border-red-600" : "")}
        autoComplete="off"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}></Textarea>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </>
  );
}
