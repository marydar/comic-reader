import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { genreEnum } from "./genres";
import { query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel"; 


const setComicGenres = mutation({
  args: {
    comicId: v.id("comics"),
    genres: v.array(genreEnum),
  },
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId(ctx);
    if(!authUserId) throw new Error("Not authenticated");
    for (const genre of args.genres) {
      await ctx.db.insert("comicGenres", {
        comicId: args.comicId,
        genre: genre,
      });
    }
  },
});
export const createComic = mutation({
  args: {
    title: v.string(),
    author: v.string(),
    description: v.string(),
    thumbnail: v.id("_storage"),
    header: v.id("_storage"),
    genres: v.array(genreEnum),
  },
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId(ctx);
    if(!authUserId) throw new Error("Not authenticated");
    const comicId = await ctx.db.insert("comics", {
      title: args.title,
      description: args.description,
      author: args.author,
      thumbnail: args.thumbnail,
      header: args.header,
      creatorId: authUserId,
    });
    for (const genre of args.genres) {
      await ctx.db.insert("comicGenres", {
        comicId: comicId,
        genre: genre,
      });
    }
    return comicId;
  },
});

// export const getComic = query({
//   args: {
//     comicId: v.id("comics"),
//   },
//   handler: async (ctx, args) => {
//     const authUserId = await getAuthUserId(ctx);
//     if(!authUserId) throw new Error("Not authenticated");
//     const comic = await ctx.db.select("comics").where("id", "=", args.comicId);
//     if (!comic) throw new Error("Comic not found");
//     return comic;
//   },
// });

// export const getAllComics = query({
//   handler: async (ctx) => {
//     const comics  = await ctx.db
//       .query("comics")
//       .collect();
//     return comics;
//   },
// });
export const getAllComics = query({
  handler: async (ctx) => {
    const comics = await ctx.db.query("comics").collect();

    // Map each comic to a new object with headerUrl
    const comicsWithUrls = await Promise.all(
      comics.map(async (comic) => ({
        ...comic,
        thumbnail: await ctx.storage.getUrl(comic.thumbnail),
        header: await ctx.storage.getUrl(comic.header),
      }))
    );

    return comicsWithUrls;
  },
});

export const getComicById = query({
  args: {
    comicId: v.id("comics"),
  },
  handler: async (ctx, args) => {
    const comic = await ctx.db.get( args.comicId);
    if (!comic) throw new Error("Comic not found");
    const comicGenres = await ctx.db
      .query("comicGenres")
      .withIndex("by_comic", (q) => q.eq("comicId", args.comicId))
      .collect();
    return {
      ...comic,
      thumbnail: await ctx.storage.getUrl(comic.thumbnail),
      header: await ctx.storage.getUrl(comic.header),
      genres: comicGenres.map((genre) => genre.genre),
    };
  },
});

export const getComics = query({
  args: {
    page: v.number(),
    pageSize: v.number(),
    searchedName: v.optional(v.string()),
    sortBy: v.optional(v.string()),
    genres: v.optional(v.array(genreEnum)),
    playlistId: v.optional(v.id("playlists")),
    subscriberId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    let comicDocs: Doc<"comics">[] = [];

    if (args.playlistId) {
      // 1. Get playlist items
      const playlistItems = await ctx.db
        .query("playlistItems")
        .filter((q) => q.eq(q.field("playlistId"), args.playlistId))
        .collect();

      const comicIds: Id<"comics">[] = playlistItems.map(
        (item) => item.comicId as Id<"comics">
      );

      // 2. Fetch comics by IDs
      const comics = await Promise.all(comicIds.map((comicId) => ctx.db.get(comicId)));

      comicDocs = comics.filter((c): c is Doc<"comics"> => c !== null);
    } else {
      // Default: get all comics
      comicDocs = await ctx.db.query("comics").collect();
    }
    if(args.subscriberId){
      const subscriptions = await ctx.db
        .query("subscriptions")
        .filter((q) => q.eq(q.field("userId"), args.subscriberId))
        .collect();
      const comicIds = subscriptions.map(s => s.comicId);
      comicDocs = comicDocs.filter((c) => comicIds.includes(c._id));
    }


    if (args.genres && args.genres.length > 0) {
      let comicGenres: Doc<"comicGenres">[] = [];
      for (const genreId of args.genres ?? []) {
        const matches = await ctx.db
          .query("comicGenres")
          .withIndex("by_genre", (q) => q.eq("genre", genreId))
          .collect();

        comicGenres.push(...matches);
      }
      const comicIds: Id<"comics">[] = comicGenres.map((item) => item.comicId as Id<"comics">);
      comicDocs = comicDocs.filter((c) => comicIds.includes(c._id));
    }

    console.log("comicDocs", comicDocs);
    console.log("args.searchedName", args.searchedName);
    if(args.searchedName && args.searchedName !== ""){
      console.log("searching for : ", args.searchedName);
      for(const comic of comicDocs){
        console.log("comic : ", comic.title);
      }
      comicDocs = comicDocs.filter((c) => c.title.toLowerCase().includes(args.searchedName?.toLowerCase()? args.searchedName.toLowerCase() : ""));
      
    }

    // 5. Sort
    if (args.sortBy === "date") {
      comicDocs.sort((a, b) => b._creationTime - a._creationTime);
    }
    else if(args.sortBy === "names"){
      comicDocs.sort((a, b) => a.title.localeCompare(b.title));
    }
    else{
      comicDocs.sort((a, b) => b._creationTime - a._creationTime);
    }
    const totalPages = Math.ceil(comicDocs.length / args.pageSize);
    console.log("total pages " + totalPages);
    console.log("lenght of comics " + comicDocs.length);

    // 6. Pagination
    const start = (args.page - 1) * args.pageSize;
    const end = start + args.pageSize;
    comicDocs = comicDocs.slice(start, end);
    
    const comicsWithUrls = await Promise.all(
      comicDocs.map(async (comic) => ({
        ...comic,
        thumbnail: await ctx.storage.getUrl(comic.thumbnail),
        header: await ctx.storage.getUrl(comic.header),
      }))
    );
    return {
      comics: comicsWithUrls,
      totalPages: totalPages,
    };
  },
  
});

export const getPopularComicsByGenre = query({
  args: {
    genre: genreEnum,
  },
  handler: async (ctx, args) => {
    let comics = await ctx.db.query("comics").collect();
    console.log("genre"+args.genre);

    const comicGenres = await ctx.db
      .query("comicGenres")
      .withIndex("by_genre", (q) => q.eq("genre", args.genre))
      .collect();
    const comicIds: Id<"comics">[] = comicGenres.map((item) => item.comicId as Id<"comics">);
    console.log("comicIds : "+comicIds);
    comics = comics.filter((c) => comicIds.includes(c._id));

    // Map each comic to a new object with headerUrl
    const comicsWithUrls = await Promise.all(
      comics.map(async (comic) => ({
        ...comic,
        thumbnail: await ctx.storage.getUrl(comic.thumbnail),
        header: await ctx.storage.getUrl(comic.header),
      }))
    );

    return comicsWithUrls;
  },
});
