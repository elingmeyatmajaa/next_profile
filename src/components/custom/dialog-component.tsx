import { Button } from "@/components/custom/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as Dialog from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";

export default function DialogComponent({
  open,
  setOpen,
  width = "max-w-2xl",
  children,
  title,
  cancelText = "Cancel",
  loading,
  confirmText = "Confirm",
  onConfirm,
}: {
  cancelText?: string;
  confirmText?: string;
  onConfirm?: (e?: any) => void;
  loading?: boolean;
  open: boolean;
  width?: string;
  title: string;
  setOpen: (open: any) => void;
  children?: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <Dialog.Overlay className="DialogOverlay">
        <Dialog.Content
          className={`${width} DialogContent`}
          onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogTitle className="">{title}</DialogTitle>
          <DialogDescription>
            <div className="mt-5">{children}</div>

            <div className="flex flex-row-reverse">
              {confirmText && (
                <Button
                  type="button"
                  className={`${
                    loading ? "bg-sky-500" : "bg-sky-600"
                  } inline-flex w-full justify-center rounded-md px-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 sm:ml-3 sm:w-auto`}
                  onClick={onConfirm}
                  disabled={loading}>
                  {loading ? (
                    <div className="flex">
                      <Loader className="animate-spin w-4 h-4 mr-2 mt-0.5" />
                      Processing...
                    </div>
                  ) : (
                    confirmText
                  )}{" "}
                </Button>
              )}
              {cancelText && (
                <Button
                  type="button"
                  className={`${
                    loading ? "bg-white" : "bg-white"
                  } inline-flex w-full border hover:bg-gray-100 justify-center rounded-md px-3  text-sm font-semibold text-gray-800 shadow-sm  sm:ml-3 sm:w-auto`}
                  onClick={setOpen}
                  disabled={loading}>
                  {loading ? (
                    <div className="flex">
                      <Loader className="animate-spin w-4 h-4 mr-2 mt-0.5" />
                      Processing...
                    </div>
                  ) : (
                    cancelText
                  )}{" "}
                </Button>
              )}
            </div>
          </DialogDescription>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Root>
  );
}
