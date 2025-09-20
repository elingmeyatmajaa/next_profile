import { useRef } from "react";

interface LoadingAlertProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  width?: string;
  loading?: boolean;
  text?: string;
}

import {
  Dialog,
  DialogContent, DialogTrigger
} from "@/components/ui/dialog";
import { Loader } from "lucide-react";

export default function LoadingAlert({
  open,
  setOpen,
  text = "Processing...",
  width = "max-w-2xl",
  loading = false,
}: LoadingAlertProps) {
  const cancelButtonRef = useRef(null);
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent className={width}>
        <div className="">
          <div className="text-center">
            <div className="flex text-sm font-medium justify-center text-sky-800">
              <Loader className="animate-spin w-5 h-5 mr-2 mt-0.5" />
              <p className="">{text}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
