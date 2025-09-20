import __ from "@/lib/lang";
import { Input } from "../ui/input";
type Props = {
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string[];
  label?: string;
  id?: string;
  className?: string;
  defaultChecked?: boolean;
  placeholder?: string;
  name?: string;
};
export default function Radio({
  value,
  onChange,
  type = "text",
  error,
  placeholder,
  name,
  defaultChecked,
  label,
  id,
  className,
}: Props) {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="text-sm mb-1">
          {__(label)}
          <span className="text-red-600">*</span>
        </label>
      )}
      <Input
        id={id}
        onChange={(e) => onChange(e)}
        value={value}
        name={name}
        defaultChecked={defaultChecked}
        type="radio"
        className={
          error
            ? `${className} border-red-500`
            : `${className} h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600`
        }
      />
      {error &&
        error.map((item, index) => (
          <div key={index} className="text-red-500 text-xs">
            {item}
          </div>
        ))}
    </div>
  );
}
