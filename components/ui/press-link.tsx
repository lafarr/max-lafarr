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
  const lastPointerType = useRef('');

  function handlePointerDown(e: React.PointerEvent<HTMLAnchorElement>): void {
    lastPointerType.current = e.pointerType;
    // Touch devices: skip immediate navigation — let onClick handle it after a confirmed tap
    if (e.pointerType === 'touch') { return; }

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

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>): void {
    // Touch tap or keyboard (Enter): let Next.js Link navigate naturally
    if (lastPointerType.current === 'touch' || e.detail === 0) { return; }
    // Mouse/pen: already navigated in pointerdown, suppress the redundant click
    e.preventDefault();
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
