import { z } from "zod"


export const EmailSchema = z.string().email()

export const UserCreateSchema = z.object({
    email: EmailSchema,
    username: z.string()
})
