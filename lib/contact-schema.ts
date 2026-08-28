import { z } from "zod"

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80, "Name is too long."),
  email: z.string().trim().email("Please enter a valid email address.").max(160),
  message: z.string().trim().min(10, "Please add a little more detail.").max(2000, "Message is too long."),
})

export const web3FormsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>
