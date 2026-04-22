'use server';

import { fetchMutation, fetchQuery } from 'convex/nextjs';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { api } from '@/convex/_generated/api';
import { auth } from '@/auth';
import { UTApi } from 'uploadthing/server';
import { notifyNewAlbum, notifyNewEvent } from './mailer';
import {
  getAlbums as _getAlbums,
  getAlbumById as _getAlbumById,
  getEvents as _getEvents,
  getEventById as _getEventById,
  getSubData as _getSubData,
  type Album,
  type Event,
  type Subscriber,
} from './queries';

export type { Album, Event, Subscriber };

async function requireAdminSession(): Promise<void> {
  const session = await auth();
  if (session?.user == null) {
    throw new Error('Unauthorized');
  }
}

// ─── Cached queries (re-exported as async wrappers to satisfy 'use server') ──

export async function getAlbums(): Promise<Album[]> {
  return await _getAlbums();
}

export async function getAlbumById(id: number): Promise<Album[]> {
  return await _getAlbumById(id);
}

export async function getEvents(): Promise<Event[]> {
  return await _getEvents();
}

export async function getEventById(id: number): Promise<Event | undefined> {
  return await _getEventById(id);
}

export async function getSubData(): Promise<Subscriber[]> {
  await requireAdminSession();
  return await _getSubData();
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function createEvent(formData: {
  name: string;
  location: string;
  date: string;
  time: string;
  ticket_link?: string;
}): Promise<void> {
  await requireAdminSession();
  await fetchMutation(api.music.createEvent, formData);
  revalidateTag('events');

  try {
    const h = await headers();
    const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'maxlafarr.com';
    const proto = h.get('x-forwarded-proto') ?? 'https';
    const subs = await fetchQuery(api.music.listSubscribers);
    const emails = subs.map((s) => s.email);
    await notifyNewEvent(formData, emails, `${proto}://${host}`);
  } catch {
    // email failures are non-fatal
  }
}

export async function updateEventById(
  id: number,
  newData: { name: string; location: string; date: string; time: string; ticket_link?: string }
): Promise<void> {
  if (id === 0) { throw new Error('id cannot be undefined'); }
  await requireAdminSession();
  await fetchMutation(api.music.updateEventById, {
    legacy_id: id,
    ...newData,
  });
  revalidateTag('events');
}

export async function deleteEvent(id: number): Promise<void> {
  if (id === 0) { throw new Error('id cannot be undefined'); }
  await requireAdminSession();
  await fetchMutation(api.music.deleteEventById, { legacy_id: id });
  revalidateTag('events');
}

// ─── Albums ───────────────────────────────────────────────────────────────────

export async function createAlbum(
  album: { title: string; release_date: string; streaming_link: string; streaming_platform: string },
  file: File
): Promise<void> {
  await requireAdminSession();
  const token = process.env.UPLOADTHING_TOKEN;
  if (token == null || token === '') { throw new Error('UPLOADTHING_TOKEN is not configured'); }
  const utapi = new UTApi({ token });
  const uploadedFiles = await utapi.uploadFiles([file]);
  const result = uploadedFiles[0];
  if (result.error != null) { throw new Error(`Upload failed: ${result.error.message}`); }
  const fileUrl = result.data.ufsUrl;
  const fileKey = result.data.key;

  try {
    await fetchMutation(api.music.createAlbum, {
      ...album,
      album_cover: fileUrl,
      album_cover_key: fileKey,
      streaming_platform: album.streaming_platform === 'soundcloud' ? 'soundcloud' : 'spotify',
    });
    revalidateTag('albums');
  } catch (err) {
    await utapi.deleteFiles([fileKey]);
    throw err;
  }

  try {
    const h = await headers();
    const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'maxlafarr.com';
    const proto = h.get('x-forwarded-proto') ?? 'https';
    const subs = await fetchQuery(api.music.listSubscribers);
    const emails = subs.map((s) => s.email);
    await notifyNewAlbum({ ...album, album_cover: fileUrl }, emails, `${proto}://${host}`);
  } catch {
    // email failures are non-fatal
  }
}

export async function updateAlbumById(
  id: number,
  data: { title: string; release_date: string; streaming_link: string; streaming_platform: string; album_cover?: string; album_cover_key?: string },
  file: File | null
): Promise<void> {
  if (id === 0) { throw new Error('id cannot be undefined'); }

  await requireAdminSession();
  const existingAlbums = await _getAlbumById(id);
  const existingAlbum = existingAlbums.at(0);
  if (existingAlbum == null) {
    throw new Error('Album not found');
  }

  let album_cover = data.album_cover;
  let album_cover_key = data.album_cover_key;
  let previousAlbumCoverKey: string | undefined;
  let uploadedFileKey: string | undefined;
  if (file != null) {
    const token = process.env.UPLOADTHING_TOKEN;
    if (token == null || token === '') { throw new Error('UPLOADTHING_TOKEN is not configured'); }
    const utapi = new UTApi({ token });
    const uploadedFiles = await utapi.uploadFiles([file]);
    const fileUrl = uploadedFiles[0]?.data?.ufsUrl;
    const fileKey = uploadedFiles[0]?.data?.key;
    if (fileUrl === undefined || fileKey === undefined) { throw new Error('File upload did not return the expected file data'); }
    album_cover = fileUrl;
    album_cover_key = fileKey;
    uploadedFileKey = fileKey;
    previousAlbumCoverKey = existingAlbum.album_cover_key;
  }

  try {
    await fetchMutation(api.music.updateAlbumById, {
      legacy_id: id,
      title: data.title,
      release_date: data.release_date,
      streaming_link: data.streaming_link,
      streaming_platform: data.streaming_platform === 'soundcloud' ? 'soundcloud' : 'spotify',
      album_cover,
      album_cover_key,
    });
    if (file != null && previousAlbumCoverKey != null && previousAlbumCoverKey !== '') {
      const token = process.env.UPLOADTHING_TOKEN;
      if (token == null || token === '') { throw new Error('UPLOADTHING_TOKEN is not configured'); }
      const utapi = new UTApi({ token });
      await utapi.deleteFiles([previousAlbumCoverKey]);
    }
    revalidateTag('albums');
  } catch (err) {
    if (uploadedFileKey != null) {
      const token = process.env.UPLOADTHING_TOKEN;
      if (token != null && token !== '') {
        const utapi = new UTApi({ token });
        await utapi.deleteFiles([uploadedFileKey]);
      }
    }
    throw err;
  }
}

export async function deleteAlbumById(id: number): Promise<void> {
  await requireAdminSession();
  const token = process.env.UPLOADTHING_TOKEN;
  if (token == null || token === '') { throw new Error('UPLOADTHING_TOKEN is not configured'); }
  const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });
  const result = await fetchMutation(api.music.deleteAlbumById, { legacy_id: id });
  const key = result.album_cover_key;
  if (key !== undefined) {
    await utapi.deleteFiles([key]);
  }
  revalidateTag('albums');
}

// ─── Subscribers ──────────────────────────────────────────────────────────────

export async function createSub(email: string): Promise<void> {
  await fetchMutation(api.music.createSubscriber, { email });
  revalidateTag('subscribers');
}

export async function deleteSub(id: number): Promise<void> {
  await requireAdminSession();
  await fetchMutation(api.music.deleteSubscriberById, { legacy_id: id });
  revalidateTag('subscribers');
}
