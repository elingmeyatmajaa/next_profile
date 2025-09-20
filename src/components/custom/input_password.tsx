"use client";
import { useState } from "react";
import { Input } from "../ui/input";
import { Eye, EyeIcon, EyeOff } from "lucide-react";

interface InputPasswordProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  placeholder?: string;
  error?: string | null;
}

export default function InputPassword({
  name,
  value,
  onChange,
  id,
  placeholder,
  error,
}: InputPasswordProps) {
  const [show, setShow] = useState(false);

  const handleToggleShowPassword = () => {
    setShow((prevState) => !prevState);
  };

  return (
    <>
      <div className="relative flex items-center">
        <Input
          id={id}
          type={show ? "text" : "password"}
          autoComplete="new-password"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          tabIndex={0}
        />
        {show ? (
          <EyeOff
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={handleToggleShowPassword}
          />
        ) : (
          <EyeIcon
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={handleToggleShowPassword}
          />
        )}
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </>
  );
}
