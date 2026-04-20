'use client';

import type React from 'react';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

type PressLinkProps = Omit<React.ComponentProps<typeof NextLink>, 'onMouseDown' | 'onClick' | 'href'> & {
  href: string;
};

export function PressLink({ href, target, children, ...props }: PressLinkProps): React.JSX.Element {
  const router = useRouter();
  const isExternal = target === '_blank';

  function handleMouseDown(e: React.MouseEvent<HTMLAnchorElement>): void {
    const url = new URL(href, window.location.href);
    const isInternal = url.origin === window.location.origin;

    if (e.button === 1 || (e.button === 0 && (e.ctrlKey || e.metaKey))) {
      // Middle-click or Ctrl/Cmd+click → new tab
      e.preventDefault();
      window.open(href, '_blank');
    } else if (e.button === 0 && e.shiftKey) {
      // Shift+click → new window
      e.preventDefault();
      window.open(href);
    } else if (e.button === 0 && !e.altKey) {
      e.preventDefault();
      if (isInternal && !isExternal) {
        router.push(href);
      } else {
        window.open(href, isExternal ? '_blank' : '_self');
      }
    }
  }

  function handleClick(e: React.MouseEvent): void {
    // Suppress the release click — we already handled everything on mousedown
    e.preventDefault();
  }

  return (
    <NextLink
      href={href}
      target={target}
      prefetch={!isExternal}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      {...props}
    >
      {children}
    </NextLink>
  );
}
