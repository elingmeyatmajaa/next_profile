export default function Button3D({
  children,
  className,
  shadowColor = "#d1d5db",
  layerColor = "#f3f4f6",
  shadowHeight = "",
  layerHeight = "",
}: {
  children: React.ReactNode;
  className?: string;
  shadowColor?: string;
  layerColor?: string;
  shadowHeight?: string;
  layerHeight?: string;
}) {
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <div
      className={classNames(`button cursor-pointer select-none
    active:translate-y-2  active:[box-shadow:0_0px_0_0_${layerColor},0_0px_0_0_${shadowColor}]
    active:border-b-[0px]
    transition-all duration-150 [box-shadow:0_5px_0_0_${layerColor},0_8px_0_0_${shadowColor}]
    rounded-xl  border-[1px]  ${className}`)}>
      <span className="flex flex-col justify-center items-center h-full text-white font-bold text-lg ">
        {children}
      </span>
    </div>
  );
}
