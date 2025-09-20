import { Switch } from "@/components/ui/switch";
import { Label } from "../ui/label";
type SwitchProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string[];
  id?: string;
};

export default function CustomSwitch({
  id,
  label,
  checked,
  error,
  onChange,
}: SwitchProps) {
  return (
    <div className="space-x-2 mb-3">
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={(checked: boolean) => {
          onChange(checked);
        }}></Switch>
      <Label className="hover:cursor-pointer" htmlFor={id}>
        {label}
      </Label>
      {error &&
        error.map((item, index) => (
          <div key={index} className="text-red-500 text-xs">
            {item}
          </div>
        ))}
    </div>
  );
}
