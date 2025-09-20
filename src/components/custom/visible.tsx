export default function Visible({
  children,
  isVisible,
}: {
  children: React.ReactNode;
  isVisible: boolean;
}) {
  return isVisible ? <>{children}</> : null;
}
