import * as v from "valibot"


export const EmailSchema = v.pipe(
    v.string(),
    v.email("Invalid email")
)
export type EmailSchema = typeof EmailSchema
