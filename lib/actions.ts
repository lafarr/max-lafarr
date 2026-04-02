'use server';

import { revalidateTag } from 'next/cache';
import { supabase } from './supabase';
import { UTApi } from 'uploadthing/server';
import {
  getAlbums as _getAlbums,
  getAlbumById as _getAlbumById,
  getEvents as _getEvents,
  getEventById as _getEventById,
  getSubData as _getSubData,
} from './queries';

export type { Album, Event, Subscriber } from './queries';

// ─── Cached queries (re-exported as async wrappers to satisfy 'use server') ──

export async function getAlbums() {
  return _getAlbums();
}

export async function getAlbumById(id: number) {
  return _getAlbumById(id);
}

export async function getEvents() {
  return _getEvents();
}

export async function getEventById(id: number) {
  return _getEventById(id);
}

export async function getSubData() {
  return _getSubData();
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function createEvent(formData: {
  name: string;
  location: string;
  date: string;
  time: string;
  ticket_link?: string;
}) {
  const { error } = await supabase.from('events').insert([formData]);
  if (error) throw new Error(error.message);
  revalidateTag('events');
}

export async function updateEventById(
  id: number,
  newData: { name: string; location: string; date: string; time: string; ticket_link?: string }
) {
  if (!id) throw new Error('id cannot be undefined');
  const { error } = await supabase.from('events').update(newData).eq('id', id);
  if (error) throw new Error(error.message);
  revalidateTag('events');
}

export async function deleteEvent(id: number) {
  if (!id) throw new Error('id cannot be undefined');
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidateTag('events');
}

// ─── Albums ───────────────────────────────────────────────────────────────────

export async function createAlbum(
  album: { title: string; release_date: string; streaming_link: string; streaming_platform: string },
  file: File
) {
  const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });
  const uploadedFiles = await utapi.uploadFiles([file]);
  const fileUrl = uploadedFiles[0]?.data?.ufsUrl;
  const fileKey = uploadedFiles[0]?.data?.key;
  if (!fileUrl) throw new Error('File URL is null after upload');

  try {
    const { error } = await supabase
      .from('albums')
      .insert([{ ...album, album_cover: fileUrl, album_cover_key: fileKey }]);
    if (error) throw new Error(error.message);
    revalidateTag('albums');
  } catch (err) {
    if (fileKey) await utapi.deleteFiles([fileKey]);
    throw err;
  }
}

export async function updateAlbumById(
  id: number,
  data: { title: string; release_date: string; streaming_link: string; streaming_platform: string; album_cover?: string },
  file: File | null
) {
  if (!id) throw new Error('id cannot be undefined');

  if (file) {
    const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });
    const uploadedFiles = await utapi.uploadFiles([file]);
    const fileUrl = uploadedFiles[0]?.data?.ufsUrl;
    if (!fileUrl) throw new Error('File URL is null after upload');
    data.album_cover = fileUrl;
  }

  const { error } = await supabase
    .from('albums')
    .update({ ...data, id: undefined })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidateTag('albums');
}

export async function deleteAlbumById(id: number) {
  const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });
  const { data, error } = await supabase
    .from('albums')
    .delete()
    .eq('id', id)
    .select();
  if (error) throw new Error(error.message);
  if (data?.[0]?.album_cover_key) {
    await utapi.deleteFiles([data[0].album_cover_key]);
  }
  revalidateTag('albums');
}

// ─── Subscribers ──────────────────────────────────────────────────────────────

export async function createSub(email: string) {
  const { error } = await supabase.from('subscribers').insert([{ email }]);
  if (error) throw new Error(error.message);
  revalidateTag('subscribers');
}

export async function deleteSub(id: number) {
  const { error } = await supabase.from('subscribers').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidateTag('subscribers');
}
