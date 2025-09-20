import React from "react";
import { Input } from "../ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: Array<string>;
  label?: string;
  className?: string;
  placeholder?: string;
};

export default function PasswordForm({
  value,
  onChange,
  error,
  label,
  className,
  placeholder,
}: Props) {
  const [show, setShow] = React.useState(false);

  const handleToggleShowPassword = () => {
    setShow((prevShow) => !prevShow);
  };

  return (
    <div className="mb-3 relative">
      {label && <div className="text-sm mb-1">{label}</div>}
      <Input
        onChange={(e) => onChange(e)}
        value={value}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className={error ? `border-red-500 ${className}` : `${className}`}
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
        {show ? (
          <EyeOffIcon onClick={handleToggleShowPassword} />
        ) : (
          <EyeIcon onClick={handleToggleShowPassword} />
        )}
      </div>
      {error &&
        error.map((item, index) => (
          <div key={index} className="text-red-500 text-xs">
            {item}
          </div>
        ))}
    </div>
  );
}
