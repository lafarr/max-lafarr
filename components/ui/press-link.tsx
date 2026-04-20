'use client';

import type React from 'react';

import Link from 'next/link';

type PressLinkProps = Omit<React.ComponentProps<typeof Link>, 'onPointerDown' | 'onClick' | 'href'> & {
  href: string;
};

export function PressLink({ href, target, children, ...props }: PressLinkProps): React.JSX.Element {
  const isExternal = target === '_blank';

  if (isExternal) {
    return (
      <Link
        href={href}
        target={target}
        onPointerDown={() => { window.open(href, '_blank'); }}
        onClick={(e) => { if (e.detail > 0) { e.preventDefault(); } }}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link href={href} target={target} {...props}>
      {children}
    </Link>
  );
}
