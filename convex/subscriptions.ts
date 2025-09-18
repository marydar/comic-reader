import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";
import { auth } from "./auth";

export const addSubscription = mutation({
  args: {
    comicId: v.id("comics"),
  },
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId(ctx);
    if(!authUserId) throw new Error("Not authenticated");
    await ctx.db.insert("subscriptions", {
      userId: authUserId,
      comicId: args.comicId,
    });
  },
});

export const removeSubscription = mutation({
    args: {
        comicId: v.id("comics"),
    },
    handler: async (ctx, args) => {
        const authUserId = await getAuthUserId(ctx);
        if(!authUserId) throw new Error("Not authenticated");

        const subscription = await ctx.db
            .query("subscriptions")
            .withIndex("by_user_and_comic", (q) => q.eq("userId", authUserId).eq("comicId", args.comicId))
            .unique();
        if(!subscription){
            console.log("subscription ant be deleted not found");
            throw new Error("subscription not found");
        }
        const subscriptionId = subscription._id;
        await ctx.db.delete(subscriptionId);
        return subscriptionId;
    },
});

export const isComicSubscribed = query({
    args: {
        userId: v.id("users"),
        comicId: v.id("comics"),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if(!user) return false;
        const subscription = await ctx.db
            .query("subscriptions")
            .withIndex("by_user_and_comic", (q) => q.eq("userId", args.userId).eq("comicId", args.comicId))
            .unique();
        return !!subscription;
    },
});

export const getSubscribedComicsByUser = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const subscriptions = await ctx.db
            .query("subscriptions")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();
        const comicIds = subscriptions.map(s => s.comicId);
        const comics = await Promise.all(
            comicIds.map((comicId) =>ctx.db.get(comicId))
        );
        return comics.filter(Boolean);
    },
});

export const getNumberOfSubscriptions = query({
    args: {
        comicId: v.id("comics"),
    },
    handler: async (ctx, args) => {
        const subscriptions = await ctx.db
            .query("subscriptions")
            .withIndex("by_comic", (q) => q.eq("comicId", args.comicId))
            .collect();
        return subscriptions.length;
    },
});