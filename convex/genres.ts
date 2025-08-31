import { v } from "convex/values";
export const genreEnum = v.union(
  v.literal("Action"),
  v.literal("Adventure"),
  v.literal("Comedy"),
  v.literal("Drama"),
  v.literal("Fantasy"),
  v.literal("Historical"),
  v.literal("Horror"),
  v.literal("Romance"),
  v.literal("Sci-Fi"),
  v.literal("Thriller"),
);