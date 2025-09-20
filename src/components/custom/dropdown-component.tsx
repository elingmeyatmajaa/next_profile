import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { IconCaretDown } from "@tabler/icons-react";

type DropdownType = {
  button: React.ReactNode;
  title?: string;
  align?: any;
  children: React.ReactNode;
};

export default function DropdownComponent({
  button,
  title,
  align = "start",
  children,
}: DropdownType) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{button}</DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {title && <DropdownMenuLabel>{title}</DropdownMenuLabel>}
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
