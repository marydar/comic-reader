import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { auth } from "./auth";
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
    const lastChapter = await ctx.db
        .query("chapters")
        .withIndex("by_comic", (q) => q.eq("comicId", args.comicId))
        .order("desc")
        .first();
    let order =  lastChapter ? lastChapter.order + 1 : 1;
    // const order = numberOfChapters.length + 1;
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
    if(!chapterComic) throw new Error("comic not found");
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
    const authUserId = await getAuthUserId(ctx);
    if(!authUserId) throw new Error("Not authenticated");
    const chapter = await ctx.db.get(args.chapterId);
    if(!chapter) throw new Error("Chapter not found");
    const chapterBookmark = await ctx.db
      .query("chapterBookmark")
      .withIndex("by_comic_and_user", (q) => q.eq("comicId", chapter.comicId).eq("userId", authUserId))
      .unique();
    if(chapterBookmark) {
      await ctx.db.patch(chapterBookmark._id, {
        chapterId: args.chapterId,
      })
    }
    else{
      await ctx.db.insert("chapterBookmark", {
        comicId: chapter.comicId,
        chapterId: args.chapterId,
        userId: authUserId,
      });
    }
    const chapterView = await ctx.db
      .query("chapterViews")
      .withIndex("by_chapter_and_user", (q) => q.eq("chapterId", args.chapterId).eq("userId", authUserId))
      .unique();
    if(chapterView) return null;
    await ctx.db.insert("chapterViews", {
      chapterId: args.chapterId,
      userId: authUserId,
    });
    await ctx.db.patch(args.chapterId, {
      views: chapter.views + 1,
    });
    
    return args.chapterId;
  },
});

export const toggleLike = mutation({
  args: {
    chapterId: v.id("chapters"),
  },
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId(ctx);
    if(!authUserId) throw new Error("Not authenticated");
    const chapter = await ctx.db.get(args.chapterId);
    if(!chapter) throw new Error("Chapter not found");
    
    const chapterLike = await ctx.db
      .query("chapterLikes")
      .withIndex("by_chapter_and_user", (q) => q.eq("chapterId", args.chapterId).eq("userId", authUserId))
      .unique();
    if(chapterLike){
      await ctx.db.delete(chapterLike._id);
      await ctx.db.patch(args.chapterId, {
        likes: chapter.likes -1,
      });
    }
    else{
      const cl = await ctx.db.insert("chapterLikes", {
        chapterId: args.chapterId,
        userId: authUserId,
      });
      if(cl){
        await ctx.db.patch(args.chapterId, {
          likes: chapter.likes + 1,
        });
      }

    }
    return args.chapterId;
  },
});

export const getIsLiked = query({
  args: {
    chapterId: v.id("chapters"),
  },
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId(ctx);
    if(!authUserId) return false
    const chapter = await ctx.db.get(args.chapterId);
    if(!chapter) throw new Error("Chapter not found");
    const chapterLike = await ctx.db
      .query("chapterLikes")
      .withIndex("by_chapter_and_user", (q) => q.eq("chapterId", args.chapterId).eq("userId", authUserId))
      .unique();
    return !!chapterLike;
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

export const getChapters = query({
  args: {
    comicId: v.id("comics"),
    sortOption: v.optional(v.string()),
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId(ctx);
    const comic = await ctx.db.get(args.comicId);
    if(!comic) throw new Error("Comic not found");
    let order : "asc" | "desc" = "desc";
    if(args.sortOption == "desc"){
      order = "desc";
    }
    else{
      order = "asc";
    }
    const chapters = await ctx.db
        .query("chapters")
        .withIndex("by_comic", (q) => q.eq("comicId", args.comicId))
        .order(order)
        .paginate(args.paginationOpts);

    
    
    return {
      ...chapters,
      page:(
        await Promise.all(
          chapters.page.map(async (chapter) => ({
            ...chapter,
            thumbnail:chapter.thumbnail? await ctx.storage.getUrl(chapter.thumbnail) : undefined,
            numberOfLikes: await ctx.db
              .query("chapterLikes")
              .withIndex("by_chapter", (q) => q.eq("chapterId", chapter._id))
              .collect()
              .then((chapterLikes)=>chapterLikes.length),
            isSeen: authUserId ?
             await ctx.db
              .query("chapterViews")
              .withIndex("by_chapter_and_user", (q) => q.eq("chapterId", chapter._id).eq("userId", authUserId))
              .unique()
              .then((chapterView)=>chapterView ? true : false)
              : false,
          }))
        )
      )
    };
  },
  
});

export const getChapterByOrder = query({
  args: {
    comicId: v.id("comics"),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const comic = await ctx.db.get(args.comicId);
    if(!comic) throw new Error("comic not found");
    const chapterDoc = await ctx.db
      .query("chapters")
      .withIndex("by_comic", (q) => q.eq("comicId", args.comicId))
      .filter((q) => q.eq(q.field("order"), args.order))
      .first();
    if(!chapterDoc) throw new Error("Chapter not found");
    return {
      ...chapterDoc,
      thumbnail: await ctx.storage.getUrl(chapterDoc.thumbnail),
      comicName: comic.title,
    };
  },
});
export const adjacent = query({
  args: { comicId: v.id("comics"), order: v.number() },
  handler: async (ctx, { comicId, order }) => {
    const next = await ctx.db
      .query("chapters")
      .withIndex("by_comic", (q) => q.eq("comicId", comicId))
      .filter((q) => q.gt(q.field("order"), order))
      .order("asc")
      .first();
    const prev = await ctx.db
      .query("chapters")
      .withIndex("by_comic", (q) => q.eq("comicId", comicId))
      .filter((q) => q.lt(q.field("order"), order))
      .order("desc")
      .first();
    return { next, prev };
  },
});