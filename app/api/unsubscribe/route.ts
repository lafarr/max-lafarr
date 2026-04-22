import { NextResponse } from 'next/server';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { verifyUnsubscribeToken } from '@/lib/email';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://maxlafarr.com';

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  if (email == null || token == null || !verifyUnsubscribeToken(email, token)) {
    return NextResponse.redirect(`${SITE_URL}/unsubscribe?status=invalid`);
  }

  try {
    await fetchMutation(api.music.deleteSubscriberByEmail, { email });
  } catch {
    return NextResponse.redirect(`${SITE_URL}/unsubscribe?status=error`);
  }

  return NextResponse.redirect(`${SITE_URL}/unsubscribe?status=success`);
}
