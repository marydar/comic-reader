import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import {v} from "convex/values";
import { genreEnum } from "./genres";



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
  // Your other tables...
});
 
export default schema;