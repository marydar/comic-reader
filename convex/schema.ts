import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import {v} from "convex/values";
import { genreEnum } from "./genres";
import { title } from "process";



const schema = defineSchema({
  ...authTables,
  comics: defineTable({
    title: v.string(),
    author: v.string(),
    description: v.string(),
    thumbnail: v.id("_storage"),
    header: v.id("_storage"),
    creatorId: v.id("users"),
  })
  .index("by_creator", ["creatorId"]),

  comicGenres: defineTable({
    comicId: v.id("comics"),
    genre: genreEnum,
  })
  .index("by_comic", ["comicId"])
  .index("by_genre", ["genre"]),

  playlists: defineTable({
    name: v.string(),
    creatorId: v.id("users"),
    // Your other columns...
  })
  .index("by_creator", ["creatorId"]),

  playlistItems: defineTable({
    playlistId: v.id("playlists"),
    comicId: v.id("comics"),
    // Your other columns...
  })
  .index("by_playlist", ["playlistId"])
  .index("by_comic", ["comicId"])
  .index("by_comic_and_playlist", ["comicId", "playlistId"]),

  playlistSave : defineTable({
    playlistId: v.id("playlists"),
    userId: v.id("users"),
    // Your other columns...
  })
  .index("by_playlist", ["playlistId"])
  .index("by_user", ["userId"])
  .index("by_playlist_and_user", ["playlistId", "userId"]),

  subscriptions: defineTable({
    userId: v.id("users"),
    comicId: v.id("comics"),
    // Your other columns...
  })
  .index("by_user", ["userId"])
  .index("by_comic", ["comicId"])
  .index("by_user_and_comic", ["userId", "comicId"]),
  chapters: defineTable({
    title: v.string(),
    thumbnail: v.id("_storage"), 
    comicId: v.id("comics"),
    order: v.number(),
    likes: v.number(),
    views: v.number(),
    // Your other columns...
  })
  .index("by_comic", ["comicId"]),
  chapterImages: defineTable({
    image: v.id("_storage"),
    order: v.number(),
    chapterId: v.id("chapters"),
    isbookmarked: v.boolean(),
    // Your other columns...
  })
  .index("by_chapter", ["chapterId"]),
  chapterViews: defineTable({
    chapterId: v.id("chapters"),
    userId: v.id("users"),
    // Your other columns...
  })
  .index("by_chapter", ["chapterId"])
  .index("by_user", ["userId"])
  .index("by_chapter_and_user", ["chapterId", "userId"]),

  chapterBookmark : defineTable({
    comicId : v.id("comics"),
    userId: v.id("users"),
    chapterId: v.id("chapters"),
    // Your other columns...
  })
  .index("by_chapter", ["chapterId"])
  .index("by_user", ["userId"])
  .index("by_comic", ["comicId"])
  .index("by_chapter_and_user", ["chapterId", "userId"])
  .index("by_comic_and_user", ["comicId", "userId"]),

  chapterLikes: defineTable({
    chapterId: v.id("chapters"),
    userId: v.id("users"),
    // Your other columns...
  })
  .index("by_chapter", ["chapterId"])
  .index("by_user", ["userId"])
  .index("by_chapter_and_user", ["chapterId", "userId"]),

  // Your other tables...
});
 
export default schema;