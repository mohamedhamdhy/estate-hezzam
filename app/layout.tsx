import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import ClientWrapper from './clientWrapper';
import './globals.css';

// Fonts
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

// Metadata (server-only)
export const metadata: Metadata = { title: 'Hesham Estate' };

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper className={`${geistSans.variable} ${geistMono.variable} min-h-full bg-[#0C0C0F]`}>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}