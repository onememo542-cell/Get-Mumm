import { ReactNode } from "react";

// Page transition is handled at the App level (AnimatedRoutes in App.tsx).
// PageWrapper is a plain semantic wrapper — motion lives at App level.
// Import animation variants directly from @/lib/motion.
export function PageWrapper({ children }: { children: ReactNode }) {
  return <div className="w-full">{children}</div>;
}
