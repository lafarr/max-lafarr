'use client';

import type React from 'react';

import { ConvexProvider, ConvexReactClient } from 'convex/react';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (convexUrl == null || convexUrl === '') {
  throw new Error('NEXT_PUBLIC_CONVEX_URL is not configured');
}

const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
