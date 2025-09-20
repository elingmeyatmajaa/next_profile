import Url from "@/config/url";
import Image from "next/image";
import { Skeleton } from "./skeleton";
type CustomImageProps = {
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
  src?: string | null;
  sizes?: string;
  onLoad?: () => void;
};
export default function CustomImage({
  className = "",
  width = 200,
  height = 200,
  alt = "",
  src = "",
  onLoad = () => {},
  sizes = "",
}: CustomImageProps) {
  if (src == "") {
    return (
      <>
        <Skeleton className={`w-[100%] h-[100%] ${className}`} />
      </>
    );
  }
  return (
    <Image
      className={className}
      alt={alt}
      height={height}
      width={width}
      sizes={sizes}
      src={Url.storage + (src ?? "")}
    />
  );
}
