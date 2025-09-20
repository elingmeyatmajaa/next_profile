
interface TitleProps {
    content: any;

}

export default function Title({ content  }: TitleProps) {
    return (
        <>
            <div className="w-full bg-[#F3EEEA] h-[230px]">
                <div>
                    {content}
                </div>
            </div>
        </>
    )
}