import __ from "@/lib/lang";
import { Badge } from "../ui/badge";
interface YesNoProps {
    value: boolean;
}

export default function YesNo({ value }: YesNoProps) {
    if (value) {
        return (
            <Badge variant="default" className="bg-emerald-600">
                {__('Yes')}
            </Badge>
        )
    }
    return (
        <Badge variant="secondary" className="bg-red-700 text-white hover:bg-red-700">
            {__('No')}
        </Badge>
    )
}