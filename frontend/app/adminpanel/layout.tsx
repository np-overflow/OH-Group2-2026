import { PhotoProvider } from "@/lib/PhotoContext";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PhotoProvider>{children}</PhotoProvider>;
}
