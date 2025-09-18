import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { genreEnum } from "./genres";
import { query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

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

type PlaylistInformation = {
  playlist: Doc<"playlists">;
  lastComicThumbnail: string | null;
  numberOfComics: number;
};
export const getPlaylistsByComic = query({
  args: {
    comicId: v.id("comics"),
  },
  handler: async (ctx, args):Promise<PlaylistInformation[] | null> => {
    const playlistItems = await ctx.db
      .query("playlistItems")
      .withIndex("by_comic", (q) => q.eq("comicId", args.comicId))
      .collect();
    const playlistIds = playlistItems.map(pi => pi.playlistId);
    const  playlistsRaw = await Promise.all(playlistIds.map((plId) => ctx.db.get(plId)));
    const playlists = playlistsRaw.filter((pl): pl is Doc<"playlists"> => pl !== null);
    if (playlists.length === 0) return null;

    const result :PlaylistInformation[] = await Promise.all(
      playlists.map(async (playlist) => {
        const playlistItems = await ctx.db
          .query("playlistItems")
          .withIndex("by_playlist", (q) => q.eq("playlistId", playlist._id))
          .order("desc")
          .collect();
        const numberOfComics = playlistItems.length;
        let lastComicThumbnail: Id<"_storage"> | null = null;
        let comicThumbnail: string | null = null;
        if (numberOfComics > 0) {
          const lastComicId = playlistItems[0].comicId as Id<"comics">;
          const lastComic = await ctx.db.get(lastComicId);
          lastComicThumbnail = lastComic?.thumbnail ?? null;
          if(lastComicThumbnail){
            comicThumbnail = await ctx.storage.getUrl(lastComicThumbnail);
          }
        }
        
        return {
          playlist,
          lastComicThumbnail: comicThumbnail,
          numberOfComics,
        };
      })
    )
    return result;
  },
});

export const getPlaylistsPagination = query({
  args: {
    page: v.number(),
    pageSize: v.number(),
    searchedName: v.optional(v.string()),
    sortBy: v.optional(v.string()),
    comicId: v.optional(v.id("comics")),
    creatorId: v.optional(v.id("users")),
    savedByUserId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    let playlistList: PlaylistInformation[] = [];
    let playlists: Doc<"playlists">[] = [];

    if (args.comicId) {
     const playlistItems = await ctx.db
      .query("playlistItems")
      .filter((q) => q.eq(q.field("comicId"), args.comicId))
      .collect();
      const playlistIds = playlistItems.map(pi => pi.playlistId);
      const  playlistsRaw = await Promise.all(playlistIds.map((plId) => ctx.db.get(plId)));
      playlists = playlistsRaw.filter((pl): pl is Doc<"playlists"> => pl !== null);
      if (playlists.length === 0) return null;

    }
    else{
      playlists = await ctx.db.query("playlists").collect();
    }
    if(args.creatorId){
      playlists = playlists.filter((pl) => pl.creatorId === args.creatorId);
    }
    if(args.savedByUserId){
       const playlistSaves = await ctx.db
        .query("playlistSave")
        .filter((q) => q.eq(q.field("userId"), args.savedByUserId))
        .collect();
        playlists = playlists.filter((pl) => playlistSaves.some((ps) => ps.playlistId === pl._id));
    }
    const result :PlaylistInformation[] = await Promise.all(
        playlists.map(async (playlist) => {
          const playlistItems = await ctx.db
            .query("playlistItems")
            .withIndex("by_playlist", (q) => q.eq("playlistId", playlist._id))
            .order("desc")
            .collect();
          const numberOfComics = playlistItems.length;
          let lastComicThumbnail: Id<"_storage"> | null = null;
          let comicThumbnail: string | null = null;
          if (numberOfComics > 0) {
            const lastComicId = playlistItems[0].comicId as Id<"comics">;
            const lastComic = await ctx.db.get(lastComicId);
            lastComicThumbnail = lastComic?.thumbnail ?? null;
            if(lastComicThumbnail){
              comicThumbnail = await ctx.storage.getUrl(lastComicThumbnail);
            }
          }
          
          return {
            playlist,
            lastComicThumbnail: comicThumbnail,
            numberOfComics,
          };
        })
      )
    playlistList = result;
    console.log("playlistList", playlistList);
    console.log("args.searchedName", args.searchedName);
    if(args.searchedName && args.searchedName !== ""){
      playlistList = playlistList.filter((pl) => pl.playlist.name.toLowerCase().includes(args.searchedName?.toLowerCase()? args.searchedName.toLowerCase() : ""));
    }
    // 5. Sort
    if (args.sortBy === "date") {
      playlistList.sort((a, b) => b.playlist._creationTime - a.playlist._creationTime);
    }
    else if(args.sortBy === "names"){
      playlistList.sort((a, b) => a.playlist.name.localeCompare(b.playlist.name));
    }
    else if(args.sortBy === "numberOfComics"){
      playlistList.sort((a, b) => b.numberOfComics - a.numberOfComics);
    }
    else{
      playlistList.sort((a, b) => b.playlist._creationTime - a.playlist._creationTime);
    }
    const totalPages = Math.ceil(playlistList.length / args.pageSize);
    console.log("total pages " + totalPages);
    console.log("lenght of comics " + playlistList.length);

    // 6. Pagination
    const start = (args.page - 1) * args.pageSize;
    const end = start + args.pageSize;
    playlistList = playlistList.slice(start, end);
    
    
    return {
      playlistsInfo: playlistList,
      totalPages: totalPages,
    };
  },
  
});

export const getPlaylistById = query({
  args: {
    playlistId: v.id("playlists"),
  },
  handler: async (ctx, args) => {
    const playlist = await ctx.db.get(args.playlistId);
    if(!playlist) return null;
    const Comics = await ctx.db
      .query("playlistItems")
      .withIndex("by_playlist", (q) => q.eq("playlistId", args.playlistId))
      .collect();
    const numberOfComics = Comics.length;
    const playlistSaves = await ctx.db
      .query("playlistSave")
      .withIndex("by_playlist", (q) => q.eq("playlistId", args.playlistId))
      .collect();
    const numberOfSaves = playlistSaves.length;
    const creator = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", playlist.creatorId))
      .unique();
    let creatorName = "unknown";
    // let creatorId: Id<"users">|null = null;
    if(creator?.name){
      creatorName = creator.name;
    }
    // if(!creator){
    //   creatorId = null;
    // }
    return {
      ...playlist,
      numberOfComics,
      numberOfSaves,
      creatorName,
      
    };
  },
});


