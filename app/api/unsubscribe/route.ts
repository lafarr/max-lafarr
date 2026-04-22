import { NextResponse } from 'next/server';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { verifyUnsubscribeToken } from '@/lib/email';

export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const { searchParams, origin } = url;
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  if (email == null || token == null || !verifyUnsubscribeToken(email, token)) {
    return NextResponse.redirect(`${origin}/unsubscribe?status=invalid`);
  }

  try {
    await fetchMutation(api.music.deleteSubscriberByEmail, { email });
  } catch {
    return NextResponse.redirect(`${origin}/unsubscribe?status=error`);
  }

  return NextResponse.redirect(`${origin}/unsubscribe?status=success`);
}
