import { SignOutButton } from '@/components/admin/sign-out-button';
import { auth } from '@/auth';

export async function UserNav() {
  const session = await auth();
  return (
    <div className="flex items-center gap-3">
      {session?.user?.email && (
        <span className="text-xs text-zinc-500 hidden sm:block">{session.user.email}</span>
      )}
      <SignOutButton />
    </div>
  );
}
