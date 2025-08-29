import { PublicIdSchema } from "$lib/validation/publicId"
import { safeParse } from "valibot"


export function match(param: string): boolean {
    const result = safeParse(PublicIdSchema, param)
    return result.success
}
