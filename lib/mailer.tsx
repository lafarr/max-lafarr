import * as React from 'react';
import { broadcastEmail } from './email';
import { NewAlbumEmail } from '@/emails/new-album';
import { NewEventEmail } from '@/emails/new-event';

export async function notifyNewAlbum(
  album: {
    title: string;
    release_date: string;
    album_cover?: string;
    streaming_link: string;
    streaming_platform: string;
  },
  subscriberEmails: string[],
): Promise<void> {
  await broadcastEmail(
    subscriberEmails,
    `New Release: ${album.title}`,
    (unsubUrl) => (
      <NewAlbumEmail
        albumTitle={album.title}
        releaseDate={album.release_date}
        albumCover={album.album_cover}
        streamingLink={album.streaming_link}
        streamingPlatform={album.streaming_platform}
        unsubscribeUrl={unsubUrl}
      />
    ),
  );
}

export async function notifyNewEvent(
  event: {
    name: string;
    date: string;
    time: string;
    location: string;
    ticket_link?: string;
  },
  subscriberEmails: string[],
): Promise<void> {
  await broadcastEmail(
    subscriberEmails,
    `New Show: ${event.name}`,
    (unsubUrl) => (
      <NewEventEmail
        eventName={event.name}
        date={event.date}
        time={event.time}
        location={event.location}
        ticketLink={event.ticket_link}
        unsubscribeUrl={unsubUrl}
      />
    ),
  );
}
