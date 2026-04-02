import { unstable_cache } from 'next/cache';
import { supabase } from './supabase';

export interface Album {
  id?: number;
  title: string;
  album_cover?: string;
  album_cover_key?: string;
  release_date: string;
  streaming_link: string;
  streaming_platform: string;
}

export interface Event {
  id?: number;
  name: string;
  location: string;
  date: string;
  time: string;
  ticket_link?: string;
}

export interface Subscriber {
  id: number;
  email: string;
  createdAt: string;
}

export const getAlbums = unstable_cache(
  async (): Promise<Album[]> => {
    const { data, error } = await supabase.from('albums').select();
    if (error) throw new Error(error.message);
    return (data ?? []).sort((a, b) => {
      const [aMonth, aYear] = a.release_date.split('/');
      const [bMonth, bYear] = b.release_date.split('/');
      return new Date(parseInt(bYear), parseInt(bMonth) - 1).getTime() -
             new Date(parseInt(aYear), parseInt(aMonth) - 1).getTime();
    });
  },
  ['albums'],
  { tags: ['albums'] }
);

export const getAlbumById = unstable_cache(
  async (id: number): Promise<Album[]> => {
    const { data, error } = await supabase.from('albums').select().eq('id', id);
    if (error) throw new Error(error.message);
    return data ?? [];
  },
  ['album-by-id'],
  { tags: ['albums'] }
);

export const getEvents = unstable_cache(
  async (): Promise<Event[]> => {
    const { data, error } = await supabase.from('events').select();
    if (error) throw new Error(error.message);
    return data ?? [];
  },
  ['events'],
  { tags: ['events'] }
);

export const getEventById = unstable_cache(
  async (id: number): Promise<Event> => {
    const { data, error } = await supabase.from('events').select().eq('id', id);
    if (error) throw new Error(error.message);
    return data?.[0];
  },
  ['event-by-id'],
  { tags: ['events'] }
);

export const getSubData = unstable_cache(
  async (): Promise<Subscriber[]> => {
    const { data, error } = await supabase.from('subscribers').select();
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => {
      const d = new Date(row.created_at);
      const month = (d.getMonth() + 1).toString();
      const day = d.getDate().toString();
      const year = d.getFullYear().toString();
      return { id: row.id, email: row.email, createdAt: `${month}-${day}-${year}` };
    });
  },
  ['subscribers'],
  { tags: ['subscribers'] }
);
