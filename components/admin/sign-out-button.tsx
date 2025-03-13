'use client';

import type React from "react";

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function SignOutButton(): React.JSX.Element {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => { void signOut({ callbackUrl: '/admin/login' }).catch(() => undefined); }}
      className="text-zinc-400 hover:text-white gap-2"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  );
}
