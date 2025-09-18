import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
export const savePlaylist = mutation({
  args: {
    playlistId: v.id("playlists"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const playlistSave = await ctx.db.insert("playlistSave", {
      playlistId: args.playlistId,
      userId: args.userId,
    });
    return playlistSave;
  },
});

export const removePlaylistSave = mutation({
  args: {
    playlistId: v.id("playlists"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const playlistSave = await ctx.db
        .query("playlistSave")
        .withIndex("by_playlist_and_user", (q) => q.eq("playlistId", args.playlistId).eq("userId", args.userId))
        .unique();
    if(!playlistSave) return null;
    const playlistSaveId = playlistSave._id;
    await ctx.db.delete(playlistSaveId);
    return playlistSaveId;
  },
});

export const getPlaylistsSavedByUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const playlistSaves = await ctx.db
      .query("playlistSave")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    return playlistSaves;
  },
});

export const getIsSavedByUser = query({
  args: {
    playlistId: v.id("playlists"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const playlistSave = await ctx.db
      .query("playlistSave")
      .withIndex("by_playlist_and_user", (q) => q.eq("playlistId", args.playlistId).eq("userId", args.userId))
      .unique();

    if(playlistSave){
        return true;
    }
    else{
        return false;
    }
      
  },
});