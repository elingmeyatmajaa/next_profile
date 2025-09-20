export default function Active({ active }: { active: boolean }) {
  if (active) {
    return (
      <>
        <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
      </>
    );
  }

  return (
    <>
      <div className="w-3 h-3 rounded-full bg-red-600"></div>
    </>
  );
}
