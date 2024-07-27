import { z } from "zod"
import { EmailSchema } from "../utils"


export const UserCreateSchema = z.object({
    email: EmailSchema,
    username: z.string().min(1, "Required"),
    permissionGroup: z.string().min(1, "Required")
})
export type UserCreateSchema = typeof UserCreateSchema

export type UserCreateFormDataInput = z.input<UserCreateSchema>
export type UserCreateFormData = z.output<UserCreateSchema>

//* Update Schema (only for API)
export const UserUpdateSchema = UserCreateSchema.partial()
export type UserUpdateSchema = typeof UserUpdateSchema

export type UserUpdateFormData = z.output<typeof UserUpdateSchema>
