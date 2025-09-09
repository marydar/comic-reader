import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addPlaylistItem = mutation({
  args: {
    playlistId: v.id("playlists"),
    comicId: v.id("comics"),
  },
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId(ctx);
    if(!authUserId) throw new Error("Not authenticated");
    await ctx.db.insert("playlistItems", {
      playlistId: args.playlistId,
      comicId: args.comicId,
    });
  },
});

export const removePlaylistItem = mutation({
    args: {
        playlistId: v.id("playlists"),
        comicId: v.id("comics"),
    },
    handler: async (ctx, args) => {
        const authUserId = await getAuthUserId(ctx);
        if(!authUserId) throw new Error("Not authenticated");

        const playlistItem = await ctx.db
            .query("playlistItems")
            .withIndex("by_comic_and_playlist", (q) => q.eq("comicId", args.comicId).eq("playlistId", args.playlistId))
            .unique();
        if(!playlistItem){
            console.log("playlistItem ant be deleted not found");
            throw new Error("Playlist item not found");
        }
        const playlistItemId = playlistItem._id;
        await ctx.db.delete(playlistItemId);
        return playlistItemId;
    },
});