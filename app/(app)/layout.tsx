import { BottomNav } from "@/components/shared/BottomNav";
import { FabWithSheet } from "@/components/shared/FabWithSheet";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
      <FabWithSheet />
    </>
  );
}
