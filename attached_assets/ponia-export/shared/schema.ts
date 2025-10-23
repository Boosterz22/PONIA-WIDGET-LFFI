import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  emailOrDiscord: text("email_or_discord").notNull(),
  projectUrl: text("project_url"),
  message: text("message").notNull(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
}).extend({
  emailOrDiscord: z.string().min(1, "Email or Discord is required"),
  name: z.string().min(1, "Name is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  projectUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
