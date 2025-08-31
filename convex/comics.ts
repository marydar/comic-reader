import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { genreEnum } from "./genres";

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