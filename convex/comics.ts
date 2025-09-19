import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { genreEnum } from "./genres";
import { query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel"; 
import { auth } from "./auth";


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

export const removeComic = mutation({
  args: {
    comicId: v.id("comics"),
  },
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId(ctx);
    if(!authUserId) throw new Error("Not authenticated");
    const comic = await ctx.db.get(args.comicId);
    if(!comic) throw new Error("Comic not found");
    //select  genre items
    const comicGenres = await ctx.db
      .query("comicGenres")
      .withIndex("by_comic", (q) => q.eq("comicId", args.comicId))
      .collect();
    //slect bookmarks
    const comicBookmark = await ctx.db
      .query("chapterBookmark")
      .withIndex("by_comic", (q) => q.eq("comicId", args.comicId))
      .unique();
    //select chapters
    const comicChapters = await ctx.db
      .query("chapters")
      .withIndex("by_comic", (q) => q.eq("comicId", args.comicId))
      .collect()
    //select like and views items
    let  comicLikes: Doc<"chapterLikes">[] = [];
    const comicViews: Doc<"chapterViews">[] = [];
    for(const chapter of comicChapters){
      comicLikes.push(...await ctx.db
        .query("chapterLikes")
        .withIndex("by_chapter", (q) => q.eq("chapterId", chapter._id))
        .collect()
      );
    }
    for (const like of comicLikes) {
      await ctx.db.delete(like._id);
    }
    for(const chapter of comicChapters){
      comicViews.push(...await ctx.db
        .query("chapterViews")
        .withIndex("by_chapter", (q) => q.eq("chapterId", chapter._id))
        .collect()
      );
    }
    //select subscriptions
    const comicSubscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_comic", (q) => q.eq("comicId", args.comicId))
      .collect();
    
    //removes all selected items
    for (const subscription of comicSubscriptions) {
      await ctx.db.delete(subscription._id);
    }
    for (const chapter of comicChapters) {
      if(comicBookmark){
        await ctx.db.delete(comicBookmark._id);
      }
      await ctx.db.delete(chapter._id);
    }
    for (const genre of comicGenres) {
      await ctx.db.delete(genre._id);
    }
    for (const like of comicLikes) {
      await ctx.db.delete(like._id);
    }
    for (const view of comicViews) {
      await ctx.db.delete(view._id);
    }
    for (const like of comicLikes) {
      await ctx.db.delete(like._id);
    }
    for (const v of comicViews) {
      await ctx.db.delete(v._id);
    }
    await ctx.db.delete(comic._id);
    return comic._id;
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
        genres: await ctx.db.query("comicGenres").withIndex("by_comic", (q) => q.eq("comicId", comic._id)).collect().then((genres)=>genres.map((g)=>g.genre)),
        views: await ctx.db
          .query("chapters")
          .withIndex("by_comic", (q) => q.eq("comicId", comic._id))
          .collect()
          .then((chapters)=>chapters.reduce((acc, chapter)=>acc+chapter.views, 0)),
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
    if (!comic) return null
    const comicGenres = await ctx.db
      .query("comicGenres")
      .withIndex("by_comic", (q) => q.eq("comicId", args.comicId))
      .collect();
    const creator = await ctx.db.get(comic.creatorId); 
    let bookmarkChapterOrder = null;
    const authUserId = await getAuthUserId(ctx);
    if(authUserId){
      const bookmarkChapter = await ctx.db
        .query("chapterBookmark")
        .withIndex("by_comic_and_user", (q) => q.eq("comicId", comic._id).eq("userId", authUserId))
        .unique();
      if(bookmarkChapter){
        const chapter = await ctx.db.get(bookmarkChapter.chapterId);
        if(chapter) {bookmarkChapterOrder = chapter.order};
      }
    }
    if(!bookmarkChapterOrder){
      const chapter = await ctx.db
        .query("chapters")
        .withIndex("by_comic", (q) => q.eq("comicId", comic._id))
        .order("asc")
        .first();
      if(chapter){
        bookmarkChapterOrder = chapter.order;
      }
    }
    return {
      ...comic,
      thumbnail: await ctx.storage.getUrl(comic.thumbnail),
      header: await ctx.storage.getUrl(comic.header),
      genres: comicGenres.map((genre) => genre.genre),
      creator,
      bookmarkChapterOrder: bookmarkChapterOrder
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
    creatorId: v.optional(v.id("users")),
    historyOfUserId: v.optional(v.id("users")),
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
    if(args.creatorId){
      comicDocs = comicDocs.filter((c) => c.creatorId === args.creatorId);
    }
    if(args.historyOfUserId){
      const seenChaptersIds = await ctx.db
        .query("chapterViews")
        .filter((q) => q.eq(q.field("userId"), args.historyOfUserId))
        .collect();
      const chapters = await Promise.all(
        seenChaptersIds.map((seenChaptersId) => ctx.db.get(seenChaptersId.chapterId))
      );
      const chaptersNotNull = chapters.filter((c)=> c !== null);
      const comicIds = chaptersNotNull.map((chapter) => chapter.comicId);
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
    const authUserId = await getAuthUserId(ctx);
    const comicsWithUrls = await Promise.all(
      comicDocs.map(async (comic) => ({
        ...comic,
        thumbnail: await ctx.storage.getUrl(comic.thumbnail),
        header: await ctx.storage.getUrl(comic.header),
        genres: await ctx.db.query("comicGenres").withIndex("by_comic", (q) => q.eq("comicId", comic._id)).collect().then((genres)=>genres.map((g)=>g.genre)),
        views: await ctx.db
          .query("chapters")
          .withIndex("by_comic", (q) => q.eq("comicId", comic._id))
          .collect()
          .then((chapters)=>chapters.reduce((acc, chapter)=>acc+chapter.views, 0)),
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
        genres: await ctx.db.query("comicGenres").withIndex("by_comic", (q) => q.eq("comicId", comic._id)).collect().then((genres)=>genres.map((g)=>g.genre)),
        views: await ctx.db
          .query("chapters")
          .withIndex("by_comic", (q) => q.eq("comicId", comic._id))
          .collect()
          .then((chapters)=>chapters.reduce((acc, chapter)=>acc+chapter.views, 0)),
          
      }))
    );

    return comicsWithUrls;
  },
});

export const getNumberOfViews = query({
  args: {
    comicId: v.id("comics"),
  },
  handler: async (ctx, args) => {
    const chapters = await ctx.db
      .query("chapters")
      .withIndex("by_comic", (q) => q.eq("comicId", args.comicId))
      .collect();
    let views = 0
    for (const chapter of chapters) {
      views += chapter.views;
    }
    return views;
  },
});

export const getNumberOfChapters = query({
  args: {
    comicId: v.id("comics"),
  },
  handler: async (ctx, args) => {
    const chapters = await ctx.db
      .query("chapters")
      .withIndex("by_comic", (q) => q.eq("comicId", args.comicId))
      .collect();
    return chapters.length;
  },
});