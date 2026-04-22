import * as React from 'react';
import { Html, Head, Body, Preview, Container, Section, Text, Hr } from '@react-email/components';

type NewEventEmailProps = {
  eventName: string;
  date: string;
  time: string;
  location: string;
  ticketLink?: string;
  unsubscribeUrl: string;
};

const amber = '#C49A3C';
const amberDim = '#8A6D2A';
const white = '#FFFFFF';
const gray = '#666666';
const grayLight = '#999999';
const border = '#1F1F1F';
const cardBg = '#0F0F0F';
const bg = '#080808';
const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(timeStr: string): string {
  const [hoursStr, minutes] = timeStr.split(':');
  const hours = parseInt(hoursStr, 10);
  const period = hours >= 12 ? 'PM' : 'AM';
  const display = hours % 12 === 0 ? 12 : hours % 12;
  return `${display}:${minutes} ${period}`;
}

export function NewEventEmail({
  eventName,
  date,
  time,
  location,
  ticketLink,
  unsubscribeUrl,
}: NewEventEmailProps): React.JSX.Element {
  return (
    <Html lang="en">
      <Head />
      <Preview>New show: {eventName} — {formatDate(date)}</Preview>
      <Body style={{ backgroundColor: bg, margin: '0', padding: '0', fontFamily: font }}>
        <Container style={{ maxWidth: '520px', margin: '0 auto', padding: '48px 24px' }}>

          {/* Wordmark */}
          <Section style={{ textAlign: 'center', paddingBottom: '40px' }}>
            <Text style={{ margin: '0', fontSize: '11px', letterSpacing: '0.42em', textTransform: 'uppercase', color: gray, fontFamily: font }}>
              MAX LAFARR — OFFICIAL
            </Text>
          </Section>

          {/* Card */}
          <Section style={{ backgroundColor: cardBg, border: `1px solid ${border}`, borderRadius: '20px', padding: '40px 36px 36px' }}>

            {/* Badge */}
            <Text style={{ margin: '0 0 16px', fontSize: '10px', letterSpacing: '0.38em', textTransform: 'uppercase', color: amber, fontFamily: font }}>
              New Show
            </Text>

            {/* Event name */}
            <Text style={{ margin: '0 0 32px', fontSize: '26px', fontWeight: '600', color: white, letterSpacing: '-0.02em', lineHeight: '1.2', fontFamily: font }}>
              {eventName}
            </Text>

            {/* Divider line */}
            <Hr style={{ border: 'none', borderTop: `1px solid ${border}`, margin: '0 0 28px' }} />

            {/* Details */}
            <Section style={{ paddingBottom: '8px' }}>
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ paddingBottom: '16px', verticalAlign: 'top', width: '30%' }}>
                      <Text style={{ margin: '0', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: gray, fontFamily: font }}>
                        Date
                      </Text>
                    </td>
                    <td style={{ paddingBottom: '16px', verticalAlign: 'top' }}>
                      <Text style={{ margin: '0', fontSize: '14px', color: grayLight, fontFamily: font }}>
                        {formatDate(date)}
                      </Text>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingBottom: '16px', verticalAlign: 'top' }}>
                      <Text style={{ margin: '0', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: gray, fontFamily: font }}>
                        Time
                      </Text>
                    </td>
                    <td style={{ paddingBottom: '16px', verticalAlign: 'top' }}>
                      <Text style={{ margin: '0', fontSize: '14px', color: grayLight, fontFamily: font }}>
                        {formatTime(time)}
                      </Text>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: 'top' }}>
                      <Text style={{ margin: '0', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: gray, fontFamily: font }}>
                        Location
                      </Text>
                    </td>
                    <td style={{ verticalAlign: 'top' }}>
                      <Text style={{ margin: '0', fontSize: '14px', color: grayLight, fontFamily: font }}>
                        {location}
                      </Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* CTA */}
            <Section style={{ paddingTop: '28px' }}>
              {ticketLink != null && ticketLink !== '' ? (
                <a
                  href={ticketLink}
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
                    marginRight: '12px',
                  }}
                >
                  Get Tickets
                </a>
              ) : (
                <a
                  href="https://maxlafarr.com/events"
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
                  View Details
                </a>
              )}
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
