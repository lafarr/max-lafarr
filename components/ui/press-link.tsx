'use client';

import type React from 'react';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

type PressLinkProps = Omit<React.ComponentProps<typeof NextLink>, 'onMouseDown' | 'href'> & {
  href: string;
};

export function PressLink({ href, target, children, ...props }: PressLinkProps): React.JSX.Element {
  const router = useRouter();
  const isExternal = target === '_blank';

  if (isExternal) {
    return (
      <NextLink
        href={href}
        target={target}
        onPointerDown={() => { window.open(href, '_blank'); }}
        onClick={(e) => { if (e.detail > 0) { e.preventDefault(); } }}
        {...props}
      >
        {children}
      </NextLink>
    );
  }

  return (
    <NextLink
      href={href}
      target={target}
      prefetch={true}
      onMouseDown={(e) => {
        const url = new URL(href, window.location.href);
        if (
          url.origin === window.location.origin &&
          e.button === 0 &&
          !e.altKey &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.shiftKey
        ) {
          e.preventDefault();
          router.push(href);
        }
      }}
      {...props}
    >
      {children}
    </NextLink>
  );
}
