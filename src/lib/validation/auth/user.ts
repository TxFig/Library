import { z } from "zod"


export const EmailSchema = z.string().min(1, "Required").email()

export const UserCreateSchema = z.object({
    email: EmailSchema,
    username: z.string().min(1, "Required"),
    permissionGroup: z.string().min(1, "Required")
})
export type UserCreateData = z.output<typeof UserCreateSchema>

export const UserUpdateSchema = UserCreateSchema.partial()
export type UserUpdateData = z.output<typeof UserUpdateSchema>
