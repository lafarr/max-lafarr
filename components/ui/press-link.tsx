'use client';

import type React from 'react';
import { useRef } from 'react';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

type PressLinkProps = Omit<React.ComponentProps<typeof NextLink>, 'onPointerDown' | 'onClick' | 'href'> & {
  href: string;
};

export function PressLink({ href, target, children, ...props }: PressLinkProps): React.JSX.Element {
  const router = useRouter();
  const isExternal = target === '_blank';
  const actedInPointerDown = useRef(false);

  function handlePointerDown(e: React.PointerEvent<HTMLAnchorElement>): void {
    actedInPointerDown.current = false;
    if (e.pointerType === 'touch') { return; }

    const url = new URL(href, window.location.href);
    const isInternal = url.origin === window.location.origin;

    if (e.button === 1 || (e.button === 0 && (e.ctrlKey || e.metaKey))) {
      e.preventDefault();
      window.open(href, '_blank');
      actedInPointerDown.current = true;
    } else if (e.button === 0 && e.shiftKey) {
      e.preventDefault();
      window.open(href);
      actedInPointerDown.current = true;
    } else if (e.button === 0 && !e.altKey) {
      e.preventDefault();
      if (isInternal && !isExternal) {
        router.push(href);
      } else {
        window.open(href, isExternal ? '_blank' : '_self');
      }
      actedInPointerDown.current = true;
    }
  }

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>): void {
    if (actedInPointerDown.current) {
      // Mouse: already navigated in pointerdown, suppress the click
      actedInPointerDown.current = false;
      e.preventDefault();
      return;
    }
    // Touch or keyboard: let Next.js Link navigate naturally
  }

  return (
    <NextLink
      href={href}
      target={target}
      prefetch={!isExternal}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      {...props}
    >
      {children}
    </NextLink>
  );
}
