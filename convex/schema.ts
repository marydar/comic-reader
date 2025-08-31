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
    creatorId: v.id("users"),
  })
  .index("by_creator", ["creatorId"]),
  comicGenres: defineTable({
    comicId: v.id("comics"),
    genre: genreEnum,
  })
  .index("by_comic", ["comicId"])
  .index("by_genre", ["genre"]),
  // Your other tables...
});
 
export default schema;