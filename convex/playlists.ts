import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { genreEnum } from "./genres";
import { query } from "./_generated/server";

export const createPlaylist = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId(ctx);
    if(!authUserId) throw new Error("Not authenticated");
    const playlistId = await ctx.db.insert("playlists", {
      name: args.name,
      creatorId: authUserId,
    });
    return playlistId;
  },
});

export const getPlaylistsByUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const playlists = await ctx.db
      .query("playlists")
      .withIndex("by_creator", (q) => q.eq("creatorId", args.userId))
      .collect();
    return playlists;
  },
});

export const getUserPlaylistsForComic = query({
  args: {
    userId: v.id("users"),
    comicId: v.id("comics"),
  },
  handler: async (ctx, args) => {
    const userPlaylists = await ctx.db
      .query("playlists")
      .withIndex("by_creator", (q) => q.eq("creatorId", args.userId))
      .collect();

    const playlistsWithComic = await ctx.db
      .query("playlistItems")
      .withIndex("by_comic", (q) => q.eq("comicId", args.comicId))
      .collect();
    return userPlaylists.map(pl =>({
        ...pl,
        hasThisComic: playlistsWithComic.some(up => up.playlistId === pl._id),
    }))
  },
});


