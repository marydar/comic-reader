import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
export const createChapter = mutation({
  args: {
    comicId: v.id("comics"),
    title: v.string(),
    thumbnail: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId(ctx);
    if(!authUserId) throw new Error("Not authenticated");
    const comic = await ctx.db.get(args.comicId);
    if(!comic) throw new Error("Comic not found");
    const comicCreatorId = comic.creatorId;
    if(comicCreatorId !== authUserId) throw new Error("Not authorized");
    const numberOfChapters = await ctx.db
        .query("chapters")
        .withIndex("by_comic", (q) => q.eq("comicId", args.comicId))
        .collect();
    const order = numberOfChapters.length + 1;
    const chapterId = await ctx.db.insert("chapters", {
      title: args.title,
      thumbnail: args.thumbnail,
      comicId: args.comicId,
      likes: 0,
      views: 0,
      order
    });
    return chapterId;
  },
});

export const removeChapter = mutation({
  args: {
    chapterId: v.id("chapters"),
  },
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId(ctx);
    if(!authUserId) throw new Error("Not authenticated");
    const chapter = await ctx.db.get(args.chapterId);
    if(!chapter) throw new Error("Chapter not found");
    const chapterComicId = chapter.comicId;
    const chapterComic = await ctx.db.get(chapterComicId);
    if(!chapterComic) throw new Error("Chapter not found");
    const chapterComicCreatorId = chapterComic.creatorId;
    if(chapterComicCreatorId !== authUserId) throw new Error("Not authorized");
    await ctx.db.delete(args.chapterId);
    return args.chapterId;
  },
});

export const addView = mutation({
  args: {
    chapterId: v.id("chapters"),
  },
  handler: async (ctx, args) => {
    const chapter = await ctx.db.get(args.chapterId);
    if(!chapter) throw new Error("Chapter not found");
    await ctx.db.patch(args.chapterId, {
      views: chapter.views + 1,
    });
    return args.chapterId;
  },
});

export const addLike = mutation({
  args: {
    chapterId: v.id("chapters"),
  },
  handler: async (ctx, args) => {
    const chapter = await ctx.db.get(args.chapterId);
    if(!chapter) throw new Error("Chapter not found");
    await ctx.db.patch(args.chapterId, {
      likes: chapter.likes + 1,
    });
    return args.chapterId;
  },
});

export const removeLike = mutation({
  args: {
    chapterId: v.id("chapters"),
  },
  handler: async (ctx, args) => {
    const chapter = await ctx.db.get(args.chapterId);
    if(!chapter) throw new Error("Chapter not found");
    await ctx.db.patch(args.chapterId, {
      likes: chapter.likes - 1,
    });
    return args.chapterId;
  },
});