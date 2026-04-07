'use client';
import { ReactNode, useEffect, useState } from 'react';

interface ClientWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function ClientWrapper({ children, className = '' }: ClientWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return <div className={mounted ? className : ''}>{children}</div>;
}