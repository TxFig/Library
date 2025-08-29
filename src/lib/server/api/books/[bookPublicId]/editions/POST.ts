import { log, logError } from "$lib/server/database/logs";
import type { AuthEventLocals } from "$lib/request-validators/auth";
import type { ApiMethodReturn } from "$lib/server/api";
import HttpCodes from "$lib/utils/http-codes";
import type { BookEditionSchemaOutput } from "$lib/validation/book";
import db from "$lib/server/database/"
import { EditionCreate } from "$lib/types";
import applyTransformSpec from "$lib/utils/transform-object";
import messages from "$lib/messages";


export type BookEditionPostMethodReturn = ApiMethodReturn<EditionCreate.Type, undefined>
export async function POST(bookPublicId: string, data: BookEditionSchemaOutput, locals: AuthEventLocals): Promise<BookEditionPostMethodReturn> {
    try {
        const result = await db.books.edition.create(bookPublicId, data)
        await log("info", messages.edition.create.success, {
            userId: locals.user.id,
            data: {
                ...data,
                image: undefined
            }
        })

        const transformed = applyTransformSpec(result, EditionCreate.spec)
        return {
            message: messages.edition.create.success,
            success: true,
            code: HttpCodes.Success.Created,
            data: transformed
        }
    } catch (err) {
        await logError(err, messages.edition.create.error, {
            userId: locals.user.id
        })
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: messages.edition.create.error
        }
    }
}

export default POST
