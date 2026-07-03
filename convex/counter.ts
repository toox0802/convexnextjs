import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";




export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const counter = await ctx.db
      .query("counter")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return counter?.count ?? 0;   // Return 0 if no counter exists yet
  },
});


export const increment = mutation({
  args: { amount: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("counter")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const amount = args.amount ?? 1;

    if (existing) {
      await ctx.db.patch(existing._id, {
        count: existing.count + amount,
      });
    } else {
      // Create first counter for this user
      await ctx.db.insert("counter", {
        userId,
        count: amount,
      });
    }
  },
});