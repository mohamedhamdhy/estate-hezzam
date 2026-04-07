'use client';

import { useState, useCallback, useEffect } from 'react';
import Sidebar from '@/components/dashboard/sideBar';
import Topbar from '@/components/dashboard/topBar';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: pd } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      if (pd) setProfile(pd);
    }
    loadProfile();
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0C0C0F]">
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={closeSidebar}
          />
          <div className="fixed top-0 left-0 bottom-0 z-50 shadow-2xl">
            <Sidebar profile={profile} onClose={closeSidebar} />
          </div>
        </>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          title="Dashboard"
          onMenuClick={() => setSidebarOpen((o) => !o)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-5">{children}</main>
      </div>
    </div>
  );
}
