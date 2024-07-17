import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { ISBNSchema } from "$lib/validation/book/isbn"
import { applyDecorators } from "$lib/decorators"
import { ParseParamsDecorator } from "$lib/decorators/parse-params"


export const load: PageServerLoad = applyDecorators(
    [ParseParamsDecorator({
        isbn: {
            schema: ISBNSchema,
            onError: () => error(HttpCodes.ClientError.BadRequest, "Invalid ISBN")
        }
    })],
    async ({ params, locals }) => {
        const { isbn } = params

        const book = await db.books.book.getEntireBookByISBN(isbn)
        if (!book) {
            error(HttpCodes.ClientError.NotFound, "Book Not Found")
        }

        const readingState = locals.user ?
            await db.auth.readingState.getBookReadingState(book.id, locals.user.id)
        : null

        return {
            book,
            readingState,
            user: locals.user ? await db.auth.user.getUserById(locals.user.id) : null
        }
    }
)
