import type React from "react";

import { SignOutButton } from '@/components/admin/sign-out-button';
import { auth } from '@/auth';

export async function UserNav(): Promise<React.JSX.Element> {
  const session = await auth();
  const email = session?.user?.email ?? null;
  return (
    <div className="flex items-center gap-3">
      {email != null && email !== '' && (
        <span className="text-xs text-zinc-500 hidden sm:block">{email}</span>
      )}
      <SignOutButton />
    </div>
  );
}
