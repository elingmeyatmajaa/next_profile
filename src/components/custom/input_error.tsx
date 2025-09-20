export default function InputError({ error = null }) {
    return (
        <>
            <div className="text text-red-600 text-sm">
                {error}
            </div>
        </>
    )
}