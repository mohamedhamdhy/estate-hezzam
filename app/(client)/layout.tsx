"use client";

import ClientNavbar from "@/components/dashboard/clientNavbar";
import ClientFooter from "@/components/dashboard/clientFooter";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ClientNavbar />
      <main className="flex-1">{children}</main>
      <ClientFooter />
    </div>
  );
}