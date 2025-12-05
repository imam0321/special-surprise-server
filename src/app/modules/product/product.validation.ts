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
})

