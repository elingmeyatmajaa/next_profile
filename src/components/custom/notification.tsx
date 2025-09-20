import CustomImage from "../ui/custom-image";

export default function Notification({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md border shadow-lg border-sky-100 flex justify-center  bg-sky-50 -mt-5 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {/* <ExclamationTriangleIcon
              className="h-5 w-5 text-sky-400"
              aria-hidden="true"
            /> */}
        </div>
        <div className="ml-3">
          <h3 className="flex items-center font-medium text-sky-800">
            <p className="">{title}</p>
            <iframe
              className="h-14 w-14  "
              src="https://lottie.host/embed/deed617d-78c6-4ea7-8351-342283427973/O0hFjdGe2b.json"></iframe>
          </h3>
          <div className="mt-2 text-sm text-sky-700">
            {/* <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
              pariatur, ipsum similique veniam quo totam eius aperiam dolorum.
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
