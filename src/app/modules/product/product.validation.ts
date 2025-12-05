import { z } from "zod";

export const createProductZodSchema = z.object({
  title: z.string({
    error: "Title is required",
  }),
  items: z
    .array(z.string(), {
      error: "Items array is required",
    })
    .nonempty("Items cannot be empty"),
  price: z.number({
    error: "Price is required",
  }),
  deliveryCharge: z.number().optional(),
  discountedPrice: z.number().optional(),
  description: z.string({
    error: "Description is required",
  }),
  categoryId: z.string({
    error: "Category ID is required",
  }),
});

export const updateProductZodSchema = z.object({
  title: z.string({
    error: "Title must be a string",
  }).min(1, "Title cannot be empty").optional(),

  items: z.array(
    z.string({
      error: "Each item must be a string",
    }).min(1, "Item cannot be empty")
  ).optional(),

  price: z.number({
    error: "Price must be a number",
  }).nonnegative("Price cannot be negative").optional(),

  deliveryCharge: z.number({
    error: "Delivery charge must be a number",
  }).nonnegative("Delivery charge cannot be negative").optional(),

  discountedPrice: z.number({
    error: "Discounted price must be a number",
  }).nonnegative("Discounted price cannot be negative").optional(),

  description: z.string({
    error: "Description must be a string",
  }).optional(),

  categoryId: z.string({
    error: "Category ID must be a string",
  }).optional(),
});