export default function FormContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid shadow grid-cols-1 gap-0 md:grid-cols-3 md:gap-5 col-span-2 border p-4 pb-5 rounded-lg mb-5">
      {children}
    </div>
  );
}
