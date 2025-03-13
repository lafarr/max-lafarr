import { mutation, query, type MutationCtx, type QueryCtx } from './_generated/server';
import type { Doc } from './_generated/dataModel';
import { streamingPlatform } from './schema';
import { v } from 'convex/values';

type NumericLegacyTable = 'albums' | 'events' | 'subscribers';
type ReadCtx = QueryCtx | MutationCtx;

function formatSubscriberDate(createdAt: string): string {
  const date = new Date(createdAt);
  const month = (date.getMonth() + 1).toString();
  const day = date.getDate().toString();
  const year = date.getFullYear().toString();
  return `${month}-${day}-${year}`;
}

async function nextNumericId(ctx: ReadCtx, table: NumericLegacyTable): Promise<number> {
  const docs = await ctx.db.query(table).collect();
  let maxLegacyId = 0;
  for (const doc of docs) {
    if (doc.legacy_id > maxLegacyId) {
      maxLegacyId = doc.legacy_id;
    }
  }
  return maxLegacyId + 1;
}

async function getAlbumDoc(ctx: ReadCtx, legacyId: number): Promise<Doc<'albums'> | null> {
  return await ctx.db
    .query('albums')
    .withIndex('by_legacy_id', (q) => q.eq('legacy_id', legacyId))
    .unique();
}

async function getEventDoc(ctx: ReadCtx, legacyId: number): Promise<Doc<'events'> | null> {
  return await ctx.db
    .query('events')
    .withIndex('by_legacy_id', (q) => q.eq('legacy_id', legacyId))
    .unique();
}

async function getSubscriberDoc(ctx: ReadCtx, legacyId: number): Promise<Doc<'subscribers'> | null> {
  return await ctx.db
    .query('subscribers')
    .withIndex('by_legacy_id', (q) => q.eq('legacy_id', legacyId))
    .unique();
}

async function getUserDoc(ctx: ReadCtx, legacyId: string): Promise<Doc<'users'> | null> {
  return await ctx.db
    .query('users')
    .withIndex('by_legacy_id', (q) => q.eq('legacy_id', legacyId))
    .unique();
}

export const listAlbums = query({
  args: {},
  handler: async (ctx) => {
    const albums = await ctx.db.query('albums').collect();
    return albums.map((album) => ({
      id: album.legacy_id,
      title: album.title,
      album_cover: album.album_cover,
      album_cover_key: album.album_cover_key,
      release_date: album.release_date,
      streaming_link: album.streaming_link,
      streaming_platform: album.streaming_platform,
    }));
  },
});

export const getAlbumById = query({
  args: { legacy_id: v.number() },
  handler: async (ctx, args) => {
    const album = await getAlbumDoc(ctx, args.legacy_id);
    if (album == null) {
      return null;
    }

    return {
      id: album.legacy_id,
      title: album.title,
      album_cover: album.album_cover,
      album_cover_key: album.album_cover_key,
      release_date: album.release_date,
      streaming_link: album.streaming_link,
      streaming_platform: album.streaming_platform,
    };
  },
});

export const listEvents = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query('events').collect();
    return events.map((event) => ({
      id: event.legacy_id,
      name: event.name,
      location: event.location,
      date: event.date,
      time: event.time,
      ticket_link: event.ticket_link,
    }));
  },
});

export const getEventById = query({
  args: { legacy_id: v.number() },
  handler: async (ctx, args) => {
    const event = await getEventDoc(ctx, args.legacy_id);
    if (event == null) {
      return null;
    }

    return {
      id: event.legacy_id,
      name: event.name,
      location: event.location,
      date: event.date,
      time: event.time,
      ticket_link: event.ticket_link,
    };
  },
});

export const listSubscribers = query({
  args: {},
  handler: async (ctx) => {
    const subscribers = await ctx.db.query('subscribers').collect();
    return subscribers.map((subscriber) => ({
      id: subscriber.legacy_id,
      email: subscriber.email,
      createdAt: formatSubscriberDate(subscriber.created_at),
    }));
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .unique();

    if (user == null) {
      return null;
    }

    return {
      id: user.legacy_id,
      email: user.email,
      password_hash: user.password_hash,
    };
  },
});

export const createEvent = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    date: v.string(),
    time: v.string(),
    ticket_link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('events', {
      legacy_id: await nextNumericId(ctx, 'events'),
      created_at: new Date().toISOString(),
      name: args.name,
      location: args.location,
      date: args.date,
      time: args.time,
      ticket_link: args.ticket_link,
    });
  },
});

export const updateEventById = mutation({
  args: {
    legacy_id: v.number(),
    name: v.string(),
    location: v.string(),
    date: v.string(),
    time: v.string(),
    ticket_link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const event = await getEventDoc(ctx, args.legacy_id);
    if (event == null) {
      throw new Error('Event not found');
    }

    await ctx.db.patch(event._id, {
      name: args.name,
      location: args.location,
      date: args.date,
      time: args.time,
      ticket_link: args.ticket_link,
    });
  },
});

export const deleteEventById = mutation({
  args: { legacy_id: v.number() },
  handler: async (ctx, args) => {
    const event = await getEventDoc(ctx, args.legacy_id);
    if (event == null) {
      throw new Error('Event not found');
    }

    await ctx.db.delete(event._id);
  },
});

export const createAlbum = mutation({
  args: {
    title: v.string(),
    album_cover: v.optional(v.string()),
    album_cover_key: v.optional(v.string()),
    release_date: v.string(),
    streaming_link: v.string(),
    streaming_platform: streamingPlatform,
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('albums', {
      legacy_id: await nextNumericId(ctx, 'albums'),
      created_at: new Date().toISOString(),
      title: args.title,
      album_cover: args.album_cover,
      album_cover_key: args.album_cover_key,
      release_date: args.release_date,
      streaming_link: args.streaming_link,
      streaming_platform: args.streaming_platform,
    });
  },
});

export const updateAlbumById = mutation({
  args: {
    legacy_id: v.number(),
    title: v.string(),
    album_cover: v.optional(v.string()),
    album_cover_key: v.optional(v.string()),
    release_date: v.string(),
    streaming_link: v.string(),
    streaming_platform: streamingPlatform,
  },
  handler: async (ctx, args) => {
    const album = await getAlbumDoc(ctx, args.legacy_id);
    if (album == null) {
      throw new Error('Album not found');
    }

    await ctx.db.patch(album._id, {
      title: args.title,
      album_cover: args.album_cover,
      album_cover_key: args.album_cover_key,
      release_date: args.release_date,
      streaming_link: args.streaming_link,
      streaming_platform: args.streaming_platform,
    });
  },
});

export const deleteAlbumById = mutation({
  args: { legacy_id: v.number() },
  handler: async (ctx, args) => {
    const album = await getAlbumDoc(ctx, args.legacy_id);
    if (album == null) {
      throw new Error('Album not found');
    }

    await ctx.db.delete(album._id);
    return { album_cover_key: album.album_cover_key };
  },
});

export const createSubscriber = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert('subscribers', {
      legacy_id: await nextNumericId(ctx, 'subscribers'),
      created_at: new Date().toISOString(),
      email: args.email,
    });
  },
});

export const deleteSubscriberById = mutation({
  args: { legacy_id: v.number() },
  handler: async (ctx, args) => {
    const subscriber = await getSubscriberDoc(ctx, args.legacy_id);
    if (subscriber == null) {
      throw new Error('Subscriber not found');
    }

    await ctx.db.delete(subscriber._id);
  },
});

export const importFromSupabase = mutation({
  args: {
    albums: v.array(v.object({
      legacy_id: v.number(),
      created_at: v.string(),
      title: v.string(),
      album_cover: v.optional(v.string()),
      album_cover_key: v.optional(v.string()),
      release_date: v.string(),
      streaming_link: v.string(),
      streaming_platform: streamingPlatform,
    })),
    events: v.array(v.object({
      legacy_id: v.number(),
      created_at: v.string(),
      name: v.string(),
      location: v.string(),
      date: v.string(),
      time: v.string(),
      ticket_link: v.optional(v.string()),
    })),
    subscribers: v.array(v.object({
      legacy_id: v.number(),
      created_at: v.string(),
      email: v.string(),
    })),
    users: v.array(v.object({
      legacy_id: v.string(),
      created_at: v.string(),
      email: v.string(),
      password_hash: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    for (const album of args.albums) {
      const existing = await getAlbumDoc(ctx, album.legacy_id);
      if (existing == null) {
        await ctx.db.insert('albums', album);
      } else {
        await ctx.db.patch(existing._id, album);
      }
    }

    for (const event of args.events) {
      const existing = await getEventDoc(ctx, event.legacy_id);
      if (existing == null) {
        await ctx.db.insert('events', event);
      } else {
        await ctx.db.patch(existing._id, event);
      }
    }

    for (const subscriber of args.subscribers) {
      const existing = await getSubscriberDoc(ctx, subscriber.legacy_id);
      if (existing == null) {
        await ctx.db.insert('subscribers', subscriber);
      } else {
        await ctx.db.patch(existing._id, subscriber);
      }
    }

    for (const user of args.users) {
      const existing = await getUserDoc(ctx, user.legacy_id);
      if (existing == null) {
        await ctx.db.insert('users', user);
      } else {
        await ctx.db.patch(existing._id, user);
      }
    }

    return {
      albums: args.albums.length,
      events: args.events.length,
      subscribers: args.subscribers.length,
      users: args.users.length,
    };
  },
});
