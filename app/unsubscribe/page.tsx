import type React from 'react';
import Link from 'next/link';

type Props = {
  searchParams: Promise<{ status?: string }>;
};

export default async function UnsubscribePage({ searchParams }: Props): Promise<React.JSX.Element> {
  const { status } = await searchParams;

  const isSuccess = status === 'success';
  const isInvalid = status === 'invalid';

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="mx-auto max-w-md text-center">
        <p className="mb-4 text-[0.62rem] uppercase tracking-[0.42em] text-zinc-600">
          Max LaFarr
        </p>

        {isSuccess && (
          <>
            <h1 className="artist-name mb-4 text-4xl">UNSUBSCRIBED</h1>
            <p className="text-sm leading-7 text-zinc-500">
              You've been removed from the mailing list. You won't receive any more updates.
            </p>
          </>
        )}

        {isInvalid && (
          <>
            <h1 className="artist-name mb-4 text-4xl">INVALID LINK</h1>
            <p className="text-sm leading-7 text-zinc-500">
              This unsubscribe link is invalid or has expired. If you'd like to unsubscribe, contact us directly.
            </p>
          </>
        )}

        {!isSuccess && !isInvalid && (
          <>
            <h1 className="artist-name mb-4 text-4xl">SOMETHING WENT WRONG</h1>
            <p className="text-sm leading-7 text-zinc-500">
              We couldn't process your request. Please try again later.
            </p>
          </>
        )}

        <Link
          href="/"
          className="mt-10 inline-block text-[0.68rem] uppercase tracking-[0.3em] text-zinc-600 transition-colors hover:text-white"
        >
          Back to Site
        </Link>
      </div>
    </main>
  );
}
