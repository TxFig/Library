import { log, logError } from "$lib/server/database/logs"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import type { BookSchemaOutput } from "$lib/validation/book"
import type { ApiMethodReturn } from ".."
import type { AuthEventLocals } from "$lib/request-validators/auth"
import applyTransformSpec from "$lib/utils/transform-object"
import { BookCreate } from "$lib/types"
import messages from "$lib/messages"


export type BookPostMethodReturn = ApiMethodReturn<BookCreate.Type, undefined>
export async function POST(data: BookSchemaOutput, locals: AuthEventLocals): Promise<BookPostMethodReturn> {
    try {
        const result = await db.books.book.create(data)
        await log("info", messages.book.create.success, {
            userId: locals.user.id,
            bookPublicId: result.publicId,
            data: {
                ...data,
                editions: data.editions.map(edition => ({
                    ...edition,
                    image: undefined
                }))
            }
        })

        const transformed = applyTransformSpec(result, BookCreate.spec)
        return {
            message: messages.book.create.success,
            success: true,
            code: HttpCodes.Success.Created,
            data: transformed
        }
    } catch (err) {
        await logError(err, messages.book.create.error, {
            userId: locals.user.id
        })
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: messages.book.create.error
        }
    }
}


export default POST
