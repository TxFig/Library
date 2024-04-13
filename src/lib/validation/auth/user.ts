import { z } from "zod"


export const UserCreateSchema = z.object({
    email: z.string().email(),
    username: z.string()
})
