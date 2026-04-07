'use client';

import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Profile } from '@/lib/types';
import { FiBarChart2, FiUsers, FiHome, FiLogOut, FiX } from 'react-icons/fi';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface Props {
  profile: Profile | null;
  onClose: () => void;
}

export default function Sidebar({ profile, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const initials = (profile?.username || profile?.email || 'AD').slice(0, 2).toUpperCase();

  const NAV: NavItem[] = [
    { label: 'Analytics', href: '/dashboard', icon: <FiBarChart2 size={22} /> },
    { label: 'Properties', href: '/dashboard/properties', icon: <FiHome size={22} /> },
    { label: 'Users', href: '/dashboard/users', icon: <FiUsers size={22} /> },
  ];

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/auth/login');
  }

  return (
    <aside className="w-55 md:w-60 lg:w-64 shrink-0 bg-[#080B11] border-r border-white/6 flex flex-col h-screen overflow-hidden">
      <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-white/6 shrink-0">
        <div className="flex items-center gap-3 md:gap-3.5">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-[9px] bg-linear-to-br from-[#D4AF37] to-[#F0D060] flex items-center justify-center shrink-0">
           <FiHome className="text-[#0C0C0F]" size={24} />
          </div>
          <div>
            <p className="font-['Cormorant_Garamond'] text-[15px] md:text-[16px] lg:text-[18px] font-bold text-white leading-none">
              EliteEstates
            </p>
            <p className="font-['Outfit'] text-[8px] md:text-[9px] text-white/25 tracking-[0.06em] uppercase">
              Admin Panel
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors cursor-pointer shrink-0"
        >
          <FiX size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 md:px-3 py-3 flex flex-col gap-1">
        <p className="font-['Outfit'] text-[8px] md:text-[9px] text-white/20 uppercase tracking-[0.12em] px-2.5 py-1.5 font-semibold">
          Menu
        </p>

        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <button
              key={href}
              onClick={() => {
                router.push(href);
                onClose();
              }}
              className={`flex items-center gap-3 md:gap-3.5 px-3 py-3 md:py-3.5 rounded-xl text-[12px] md:text-[13px] lg:text-[14px] font-['Outfit'] font-medium transition-all duration-150 w-full text-left
                ${active
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/15'
                  : 'text-white/45 hover:bg-white/5 hover:text-white/80 border border-transparent'
                }`}
            >
              <span className="w-6 h-6 md:w-7 md:h-7">{icon}</span>
              <span className="truncate">{label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
            </button>
          );
        })}
      </nav>

      <div className="px-2.5 md:px-3 py-3 border-t border-white/6 shrink-0">
        <div className="flex items-center gap-2.5 md:gap-3 px-2.5 py-2 rounded-xl bg-white/3 border border-white/5">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-linear-to-br from-[#D4AF37]/20 to-[#1A6E8E]/20 border border-[#D4AF37]/25 flex items-center justify-center shrink-0 overflow-hidden">
            {profile?.profile_image ? (
              <img src={profile.profile_image} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="font-['Cormorant_Garamond'] text-[14px] md:text-[15px] font-bold text-[#D4AF37]">
                {initials}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-['Outfit'] text-[11px] md:text-[12px] lg:text-[13px] font-semibold text-white/75 truncate">
              {profile?.username || 'Admin'}
            </p>
            <p className="font-['Outfit'] text-[9px] md:text-[10px] lg:text-[11px] text-white/25 truncate">
              {profile?.email || ''}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="text-white/25 hover:text-white/60 transition-colors cursor-pointer p-1 md:p-1.5 rounded-lg hover:bg-white/5"
          >
            <FiLogOut size={22} />
          </button>
        </div>
      </div>
    </aside>
  );
}