import { PublicIdSchema } from "$lib/validation/book/publicId"


export function match(param: string): boolean {
    const result = PublicIdSchema.safeParse(param)
    return result.success
}
