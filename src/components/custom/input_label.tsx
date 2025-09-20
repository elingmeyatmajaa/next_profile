import { Label } from "@/components/ui/label"

interface InputLabelProps {
    children: React.ReactNode;
    htmlFor?: string;
}
export default function InputLabel({
    children,
    htmlFor

}: InputLabelProps) {
    return (
        <>
            <Label
                htmlFor={htmlFor}
                className=""
            >
                {children}
            </Label >
            <div className="mb-2"></div>
        </>
    )
}