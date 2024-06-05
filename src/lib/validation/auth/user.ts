import { z } from "zod"


export const EmailSchema = z.string().min(1, "Required").email()

export const UserInsertSchema = z.object({
    email: EmailSchema,
    username: z.string().min(1, "Required"),
    admin: z.boolean().default(false),
    permissionGroup: z.string().min(1, "Required")
})
