import { z } from "zod"


export const EmailSchema = z.string().min(1, "Required").email()

export const UserCreateSchema = z.object({
    email: EmailSchema,
    username: z.string()
})
