import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  todos: defineTable({
    userId: v.id("users"),
    text: v.string(),
  }).index("by_user", ["userId"]),
  counter: defineTable({
    userId: v.id("users"),
    count: v.number()

  }).index("by_user", ["userId"])
});
