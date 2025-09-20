"use client";

import type React from "react";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Input } from "../ui/input";

interface QuantityInputProps {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;

  onChange: (e: number) => void;
  error?: string[];
  label?: string;
  id?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function QuantityInput({
  initialValue = 1,
  min,
  max = 999,
  step = 1,
  onChange,

  error,
  label,
  id,
  required,
  className,
  disabled,
  placeholder,
}: QuantityInputProps) {
  const [value, setValue] = useState(initialValue);

  const increment = () => {
    if (value < max) {
      const newValue = value + step;
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  const decrement = () => {
    if (min) {
      if (value > min) {
        const newValue = value - step;
        setValue(newValue);
        onChange?.(newValue);
      }
    } else {
      const newValue = value - step;
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value, 10);
    if (min) {
      if (!isNaN(newValue) && newValue >= min && newValue <= max) {
        setValue(newValue);
        onChange?.(newValue);
      }
    } else {
      if (!isNaN(newValue) && newValue <= max) {
        setValue(newValue);
        onChange?.(newValue);
      }
    }
  };

  return (
    <div className="flex items-center rounded-lg overflow-hidden justify-between shadow-lg border border-gray-100 bg-white">
      <button
        onClick={decrement}
        disabled={min ? value <= min : false}
        className="flex items-center justify-center h-9 w-9 bg-sky-900 text-white transition-all duration-200 hover:bg-gray-700 active:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease quantity">
        <Minus className="h-5 w-5" />
      </button>

      <input
        id={id}
        disabled={disabled}
        onChange={(e) => handleInputChange(e)}
        value={value}
        placeholder={placeholder}
        className={error ? `${className}` : `${className}`}
      />

      <button
        onClick={increment}
        disabled={value >= max}
        className="flex items-center justify-center h-9 w-9 bg-sky-900 text-white transition-all duration-200 hover:bg-gray-700 active:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase quantity">
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}
