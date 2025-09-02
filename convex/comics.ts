import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { genreEnum } from "./genres";
import { query } from "./_generated/server";

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
