export default function Divider({
  title = "Continue",
  className,
}: {
  title?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center">
        <span className={`bg-white px-2 text-sm text-gray-500 `}>{title}</span>
      </div>
    </div>
  );
}
