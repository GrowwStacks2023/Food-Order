import { z } from "zod";

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
});

export const menuItemSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string(),
  dietary: z.array(z.string()).optional(),
});

export const cartItemSchema = z.object({
  id: z.string(),
  menuItem: menuItemSchema,
  quantity: z.number(),
});

export const recommendationSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string(),
  reason: z.string(),
});

export const webhookRequestSchema = z.object({
  food_item_id: z.string(),
  item_name: z.string(),
  item_price: z.number(),
  category: z.string(),
  current_cart_items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
  })),
  timestamp: z.string(),
});

export type Category = z.infer<typeof categorySchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;
export type WebhookRequest = z.infer<typeof webhookRequestSchema>;

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = { id: string; username: string; password: string };
