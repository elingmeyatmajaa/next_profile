import { Label } from "../ui/label";

type FormGroupProps = {
    children: React.ReactNode;
    label?: string;
};
export default function FormGroup({ children, label }: FormGroupProps) {
    return (
        <div className="mb-1">
            <Label>{label}</Label>
            {children}
        </div>
    )
}