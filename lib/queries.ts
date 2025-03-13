import { unstable_cache } from 'next/cache';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { sortAlbumsByReleaseDateDesc } from '@/lib/music';

export type Album = {
  id?: number;
  title: string;
  album_cover?: string;
  album_cover_key?: string;
  release_date: string;
  streaming_link: string;
  streaming_platform: string;
}

export type Event = {
  id?: number;
  name: string;
  location: string;
  date: string;
  time: string;
  ticket_link?: string;
}

export type Subscriber = {
  id: number;
  email: string;
  createdAt: string;
}

export const getAlbums = unstable_cache(
  async (): Promise<Album[]> => {
    const data = await fetchQuery(api.music.listAlbums);
    return sortAlbumsByReleaseDateDesc(data);
  },
  ['albums'],
  { tags: ['albums'] }
);

export const getAlbumById = unstable_cache(
  async (id: number): Promise<Album[]> => {
    const album = await fetchQuery(api.music.getAlbumById, { legacy_id: id });
    return album == null ? [] : [album];
  },
  ['album-by-id'],
  { tags: ['albums'] }
);

export const getEvents = unstable_cache(
  async (): Promise<Event[]> => {
    return await fetchQuery(api.music.listEvents);
  },
  ['events'],
  { tags: ['events'] }
);

export const getEventById = unstable_cache(
  async (id: number): Promise<Event | undefined> => {
    return await fetchQuery(api.music.getEventById, { legacy_id: id }) ?? undefined;
  },
  ['event-by-id'],
  { tags: ['events'] }
);

export const getSubData = unstable_cache(
  async (): Promise<Subscriber[]> => {
    return await fetchQuery(api.music.listSubscribers);
  },
  ['subscribers'],
  { tags: ['subscribers'] }
);
