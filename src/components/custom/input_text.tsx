"use client";

import { Input } from "../ui/input";

interface InputTextProps {
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  placeholder?: string;
  error?: string | null;
  disabled?: boolean;
  addons?: React.ReactNode;
}
export default function InputText({
  name,
  value,
  onChange = () => {},
  id,
  placeholder,
  error,
  disabled,
  addons = null,
}: InputTextProps) {
  if (addons != null) {
    return (
      <>
        <div className="flex flex-col">
          <div className="relative flex items-center">
            <Input
              id={id}
              type="text"
              autoComplete="off"
              name={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
            />
            {addons}
          </div>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </>
    );
  }
  return (
    <>
      <Input
        id={id}
        type="text"
        autoComplete="off"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </>
  );
}
