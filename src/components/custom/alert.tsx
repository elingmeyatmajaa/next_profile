import { IconAlertTriangle, IconX } from "@tabler/icons-react";

export default function Alert({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md drop-shadow-lg text-center bg-yellow-100 p-4 ${className}`}>
      <div className="flex">
        <div className="flex">
          <div className="flex-shrink-0">
            <IconAlertTriangle
              className="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3 ">
            <p className="text-sm text-center font-medium text-yellow-800">
              {message}
            </p>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className="inline-flex rounded-md bg-yellow-100 p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50">
              <span className="sr-only">Dismiss</span>
              <IconX className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
