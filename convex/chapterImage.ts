import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

import { query } from "./_generated/server";

export const addChapterImage = mutation({
  args: {
    chapterId: v.id("chapters"),
    image: v.id("_storage"),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId(ctx);
    if(!authUserId) throw new Error("Not authenticated");
    const chapter = await ctx.db.get(args.chapterId);
    if(!chapter) throw new Error("Chapter not found");
    const numberOfImages = await ctx.db
        .query("chapterImages")
        .withIndex("by_chapter", (q) => q.eq("chapterId", args.chapterId))
        .collect();
    let order = numberOfImages.length + 1;
    if(args.order){
        order = args.order;
    }
    await ctx.db.insert("chapterImages", {
      chapterId: args.chapterId,
      image: args.image,
      isbookmarked: false,
      order: order,
    });
  },
});
export const removeChapterImage = mutation({
  args: {
    chapterId: v.id("chapters"),
    imageId: v.id("chapterImages"),
  },
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId(ctx);
    if(!authUserId) throw new Error("Not authenticated");
    const chapter = await ctx.db.get(args.chapterId);
    if(!chapter) throw new Error("Chapter not found");
    const chapterImage = await ctx.db
        .query("chapterImages")
        .withIndex("by_chapter", (q) => q.eq("chapterId", args.chapterId))
        .unique();
    if(!chapterImage){
      console.log("chapterImage ant be deleted not found");
      throw new Error("Chapter image not found");
    }
    const chapterImageId = chapterImage._id;
    const chapterImageOrder = chapterImage.order;
    // update chapter order
     await ctx.db.patch(chapterImageId, {
      order: chapterImageOrder - 1,
    });

    //update all the chapteerImages order that are greater than the deleted one
    const allChapterImages =await ctx.db
      .query("chapterImages")
      .withIndex("by_chapter", (q) => q.eq("chapterId", args.chapterId))
      .filter((q) => q.gt(q.field("order"), chapterImageOrder))
      .collect()
    allChapterImages.forEach((chapterImage) => {
      ctx.db.patch(chapterImage._id, {
        order: chapterImage.order - 1,
      });
    });
    
    await ctx.db.delete(chapterImageId);
    return chapterImageId;
  },
});

export const updateOrder = mutation({
    args: {
        chapterImageId: v.id("chapterImages"),
        order: v.number(),
    },
    handler: async (ctx, args) => {
        const authUserId = await getAuthUserId(ctx);
        if(!authUserId) throw new Error("Not authenticated");
        const chapterImage = await ctx.db.get(args.chapterImageId);
        if(!chapterImage) throw new Error("Chapter image not found");
        
        await ctx.db.patch(args.chapterImageId, {
            order: args.order,
        });
        return args.chapterImageId;
    },
});

export const listPaginated = query({
  args: {
    chapterId: v.id("chapters"),
    cursor: v.optional(v.any()),   // convex pagination cursor
    pageSize: v.number(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { chapterId, cursor, pageSize }) => {
    console.log("listPaginated", chapterId, cursor, pageSize)
    const images =  await ctx.db
      .query("chapterImages")
      .filter((q) => q.eq(q.field("chapterId"), chapterId))
      .order("asc")
      .paginate({ cursor, numItems: pageSize });

    console.log("images", images)

    return {
      ...images,
      page:(
        await Promise.all(
          images.page.map(async (chapter) => ({
            ...chapter,
            imageUrl:await ctx.storage.getUrl(chapter.image),
          }))
        )
      )
    }
  },
});

export const getChapterImages = query({
  args: {
    chapterId: v.id("chapters"),
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    const chapter = await ctx.db.get(args.chapterId);
    if(!chapter) throw new Error("chapter not found");
    const images = await ctx.db
        .query("chapterImages")
        .withIndex("by_chapter", (q) => q.eq("chapterId", args.chapterId))
        .order("asc")
        .paginate(args.paginationOpts);
    
    return {
      ...images,
      page:(
        await Promise.all(
          images.page.map(async (chapter) => ({
            ...chapter,
            imgUrl: await ctx.storage.getUrl(chapter.image),
          }))
        )
      )
    };
  },
  
});