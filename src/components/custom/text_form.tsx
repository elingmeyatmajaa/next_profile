import __ from "@/lib/lang";
import { Input } from "../ui/input";
type Props = {
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string[];
  label?: string;
  id?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  size?: number;
  showErrorMessages?: boolean;
  addons?: React.ReactNode;
};
export default function TextForm({
  type = "text",
  value = type === "number" ? 0 : "",
  onChange,
  error,
  placeholder,
  size = 0,
  disabled = false,
  label,
  required = false,
  showErrorMessages = true,
  id,
  className,
  addons = null,
}: Props) {
  if (addons != null) {
    return (
      <div className="mb-3">
        {label && (
          <label htmlFor={id} className="text-sm mb-2 font-semibold">
            {__(label)}
            {required && <span className="text-red-600">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <Input
            size={size}
            id={id}
            disabled={disabled}
            onChange={(e) => onChange(e)}
            value={value}
            placeholder={placeholder}
            type={type}
            className={error ? `${className} border-red-500` : `${className}`}
          />
          {addons}
        </div>

        {/* {error &&
          error.map((item, index) => (
            <div key={index} className="text-red-500 mt-1 text-xs">
              {item}
            </div>
          ))} */}
        {error && showErrorMessages && (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-3">
      {label && (
        <div className="mb-1">
          <label htmlFor={id} className="text-sm font-semibold">
            {__(label)}
            {required && <span className="text-red-600">*</span>}
          </label>
        </div>
      )}
      <Input
        id={id}
        onChange={(e) => onChange(e)}
        value={value}
        placeholder={placeholder}
        type={type}
        className={error ? `${className} border-red-500` : `${className}`}
      />
      {/* {error &&
        error.map((item, index) => (
          <div key={index} className="text-red-500 text-xs">
            {item}
          </div>
        ))} */}
      {error && showErrorMessages && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
