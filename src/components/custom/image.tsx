interface Props {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
}
import NextImage from "next/image";
export default function Image({
    src,
    width,
    height,
    alt,
    className
}: Props) {
    if (src === "") {
        return (
            <div
                className=" bg-gray-200 rounded-full"
                style={{
                    width: width,
                    height: height
                }}
            ></div>
        )
    }
    return (
        <>
            <NextImage
                alt={alt}
                style={{
                    width: 'auto',
                    height: 'auto'
                }}
                src={process.env.NEXT_PUBLIC_REMOTE_IMAGE_BASE_URL + src}
                className={className}
                width={width}
                height={height}
            // width={width}
            // height={height}
            // className="rounded-full"
            />
        </>
    )
}