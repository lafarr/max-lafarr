import * as React from 'react';
import { Html, Head, Body, Preview, Container, Section, Text, Img, Hr } from '@react-email/components';

type NewAlbumEmailProps = {
  albumTitle: string;
  releaseDate: string;
  albumCover?: string;
  streamingLink: string;
  streamingPlatform: string;
  unsubscribeUrl: string;
};

const amber = '#C49A3C';
const amberDim = '#8A6D2A';
const white = '#FFFFFF';
const gray = '#666666';
const border = '#1F1F1F';
const cardBg = '#0F0F0F';
const bg = '#080808';
const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export function NewAlbumEmail({
  albumTitle,
  releaseDate,
  albumCover,
  streamingLink,
  streamingPlatform,
  unsubscribeUrl,
}: NewAlbumEmailProps): React.JSX.Element {
  const listenUrl = streamingPlatform === 'soundcloud'
    ? streamingLink
    : `https://open.spotify.com/album/${streamingLink}`;

  return (
    <Html lang="en">
      <Head />
      <Preview>New release: {albumTitle} — out now</Preview>
      <Body style={{ backgroundColor: bg, margin: '0', padding: '0', fontFamily: font }}>
        <Container style={{ maxWidth: '520px', margin: '0 auto', padding: '48px 24px' }}>

          {/* Wordmark */}
          <Section style={{ textAlign: 'center', paddingBottom: '40px' }}>
            <Text style={{ margin: '0', fontSize: '11px', letterSpacing: '0.42em', textTransform: 'uppercase', color: gray, fontFamily: font }}>
              MAX LAFARR — OFFICIAL
            </Text>
          </Section>

          {/* Card */}
          <Section style={{ backgroundColor: cardBg, border: `1px solid ${border}`, borderRadius: '20px', overflow: 'hidden' }}>

            {/* Album cover */}
            {albumCover != null && (
              <Img
                src={albumCover}
                alt={albumTitle}
                width={520}
                style={{ width: '100%', display: 'block', borderBottom: `1px solid ${border}` }}
              />
            )}

            <Section style={{ padding: '36px 36px 12px' }}>
              {/* Badge */}
              <Text style={{ margin: '0 0 16px', fontSize: '10px', letterSpacing: '0.38em', textTransform: 'uppercase', color: amber, fontFamily: font }}>
                New Release
              </Text>

              {/* Title */}
              <Text style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '600', color: white, letterSpacing: '-0.02em', lineHeight: '1.2', fontFamily: font }}>
                {albumTitle}
              </Text>

              {/* Meta */}
              <Text style={{ margin: '0 0 32px', fontSize: '13px', color: gray, fontFamily: font }}>
                {releaseDate} · {streamingPlatform === 'soundcloud' ? 'SoundCloud' : 'Spotify'}
              </Text>

              {/* CTA */}
              <Section style={{ paddingBottom: '36px' }}>
                <a
                  href={listenUrl}
                  style={{
                    display: 'inline-block',
                    backgroundColor: white,
                    color: '#000000',
                    fontSize: '11px',
                    fontWeight: '500',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    padding: '14px 32px',
                    borderRadius: '100px',
                    fontFamily: font,
                  }}
                >
                  Listen Now
                </a>
              </Section>
            </Section>
          </Section>

          {/* Footer */}
          <Hr style={{ border: 'none', borderTop: `1px solid ${border}`, margin: '40px 0 28px' }} />
          <Section style={{ textAlign: 'center' }}>
            <Text style={{ margin: '0 0 12px', fontSize: '12px', color: gray, lineHeight: '1.6', fontFamily: font }}>
              You're receiving this because you subscribed to Max LaFarr updates.
            </Text>
            <a
              href={unsubscribeUrl}
              style={{ fontSize: '11px', color: amberDim, textDecoration: 'underline', fontFamily: font }}
            >
              Unsubscribe
            </a>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}
