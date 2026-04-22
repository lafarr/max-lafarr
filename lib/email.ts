import { Resend } from 'resend';
import { createHmac, timingSafeEqual } from 'crypto';
import type { ReactElement } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://maxlafarr.com';
const FROM_EMAIL = 'Max LaFarr <noreply@maxlafarr.com>';

export function generateUnsubscribeToken(email: string): string {
  return createHmac('sha256', process.env.AUTH_SECRET ?? '')
    .update(email)
    .digest('hex');
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = generateUnsubscribeToken(email);
  try {
    return timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

export function buildUnsubscribeUrl(email: string): string {
  const token = generateUnsubscribeToken(email);
  return `${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}

export async function broadcastEmail(
  to: string[],
  subject: string,
  renderTemplate: (unsubUrl: string) => ReactElement,
): Promise<void> {
  if (to.length === 0) { return; }
  const resend = new Resend(process.env.RESEND_API_KEY);
  await Promise.allSettled(
    to.map((email) =>
      resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject,
        react: renderTemplate(buildUnsubscribeUrl(email)),
      })
    )
  );
}
