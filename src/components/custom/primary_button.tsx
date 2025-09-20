import { Loader } from "lucide-react";
import { Button } from "../ui/button";
interface Props {
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
    isLoading?: boolean;
}
export default function PrimaryButton({
    children,
    disabled,
    onClick,
    className,
    isLoading

}: Props) {
    return (
        <Button
            onClick={onClick}
            className={className}
            disabled={disabled || isLoading}
        >
            {children}

            {isLoading && (<Loader className="w-5 h-5 ml-2 animate-spin" />)}
        </Button>
    )
}