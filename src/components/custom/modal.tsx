import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import __ from "@/lib/lang";
import { IconLoader } from "@tabler/icons-react";

interface ModalProps {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onCancel: () => void;
  onAdd?: () => void;
  cancelText?: string;
  addText?: string;
  confirmText?: any;
  onConfirm?: (e?: any) => void;
  children?: React.ReactNode;
  width?: string;
  buttonCancelPosition?: string;
  loading?: boolean;
  buttonColor?: string;
}
export default function Modal({
  title,
  open,
  setOpen,
  buttonColor,
  onAdd = () => {},
  addText = "",
  onCancel,
  buttonCancelPosition = "bottom",
  cancelText,
  confirmText = "",
  onConfirm,
  children,
  width = "max-w-2xl",
  loading = false,
}: ModalProps) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel
                className={`relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6 ${width}`}>
                <Dialog.Title
                  as="h3"
                  className={
                    buttonCancelPosition == "top"
                      ? "flex justify-between"
                      : "" + "text-lg  text-gray-900 mb-5 pb-1 border-b"
                  }>
                  {title}
                  {buttonCancelPosition == "top" && (
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto mb-5"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}>
                      {cancelText}
                    </button>
                  )}
                </Dialog.Title>

                {children}
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  {confirmText && (
                    <button
                      type="button"
                      className={`${
                        loading ? "bg-sky-500" : "bg-sky-600"
                      } inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 sm:ml-3 sm:w-auto`}
                      onClick={onConfirm}
                      disabled={loading}>
                      {loading ? (
                        <div className="flex">
                          <IconLoader className="animate-spin w-4 h-4 mr-2 mt-0.5" />
                          Processing...
                        </div>
                      ) : (
                        confirmText
                      )}{" "}
                    </button>
                  )}
                  {buttonCancelPosition == "bottom" && (
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}>
                      {cancelText}
                    </button>
                  )}
                  {addText && (
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 sm:ml-3 sm:w-auto mr-3"
                      onClick={() => onAdd()}
                      ref={cancelButtonRef}>
                      {addText}
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
