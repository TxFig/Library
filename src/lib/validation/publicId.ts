import * as v from "valibot"


export const PublicIdSchema = v.pipe(
    v.string(),
    v.regex(/^[a-zA-Z0-9]{8}$/, "Invalid Public Id")
)
