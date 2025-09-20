export default function Text({ children }: { children: React.ReactNode }) {
    if (children === "") {
        return (
            <div className="bg-gray-200 w-100 text-gray-200 w-[150px]">
                ...
            </div>
        )
    }
    return (
        <>{children}</>
    );
}