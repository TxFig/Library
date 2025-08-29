import * as v from "valibot"
import { EmailSchema } from "./email"


export const LoginSchema = v.object({
    email: EmailSchema
})
export type LoginSchema = typeof LoginSchema
