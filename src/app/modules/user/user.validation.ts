import z from "zod";

export const AddressZodSchema = z.object({
  city: z.string().min(2, "City is required").optional(),
  country: z.string().min(2, "Country is required").optional(),
  address_detail: z.string().min(3, "Address detail required").optional(),
});

export const registerCustomerZodSchema = z.object({
  name: z.string({
    error: "Name is required",
  }).min(2, "Name must be at least 2 characters long"),
  email: z.email("Invalid email address"),
  password: z.string({
    error: "Password is required",
  }).min(6, "Password must be at least 6 characters long"),
  phone: z.string(),
  address: AddressZodSchema
})

export const registerModeratorZodSchema = z.object({
  name: z.string({
    error: "Name is required",
  }).min(2, "Name must be at least 2 characters long"),
  email: z.email("Invalid email address"),
  password: z.string({
    error: "Password is required",
  }).min(6, "Password must be at least 6 characters long"),
  nid: z.string().min(13, "NID must be at least 13 characters long"),
  phone: z.string(),
  address: AddressZodSchema
})

export const updateUserZodSchema = z.object({
  name: z.string({
    error: "Name is required",
  }).min(2, "Name must be at least 2 characters long").optional(),
  phone: z.string().optional(),
  address: AddressZodSchema.optional()
})