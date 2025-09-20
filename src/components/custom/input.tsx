"use client";
import { useEffect, useRef } from "react";

interface InputProps {
  type: string;
  focus: boolean;
  value: any;
  onChange: any;
  placeholder: string;
}

export default function Input({
  placeholder,
  type,
  focus,
  value,
  onChange,
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (focus && inputRef) {
      if (inputRef?.current != null) {
        inputRef?.current?.focus();
      }
    }
  }, [inputRef, focus]);
  return (
    <input
      id="email"
      name="email"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      type={type}
      ref={inputRef}
      autoComplete="email"
      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
}
