
interface BodyProps {
    content: any;
}

export default function Body({ content }: BodyProps) {
    return (
        <>
            <div className="mx-auto w-full">
                <div>
                    {content}
                </div>
            </div>
        </>
    )
}