import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const streamingPlatform = v.union(v.literal('spotify'), v.literal('soundcloud'));

export default defineSchema({
  albums: defineTable({
    legacy_id: v.number(),
    created_at: v.string(),
    title: v.string(),
    album_cover: v.optional(v.string()),
    album_cover_key: v.optional(v.string()),
    release_date: v.string(),
    streaming_link: v.string(),
    streaming_platform: streamingPlatform,
  }).index('by_legacy_id', ['legacy_id']),
  events: defineTable({
    legacy_id: v.number(),
    created_at: v.string(),
    name: v.string(),
    location: v.string(),
    date: v.string(),
    time: v.string(),
    ticket_link: v.optional(v.string()),
  }).index('by_legacy_id', ['legacy_id']),
  subscribers: defineTable({
    legacy_id: v.number(),
    created_at: v.string(),
    email: v.string(),
  }).index('by_legacy_id', ['legacy_id']).index('by_email', ['email']),
  users: defineTable({
    legacy_id: v.string(),
    created_at: v.string(),
    email: v.string(),
    password_hash: v.string(),
  }).index('by_legacy_id', ['legacy_id']).index('by_email', ['email']),
});
