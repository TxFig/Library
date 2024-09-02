import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { ISBNSchema } from "$lib/validation/book/isbn"
import { applyDecorators } from "$lib/decorators"
import { ParseParamsDecorator } from "$lib/decorators/parse-params"


const load: PageServerLoad = async ({ params, locals }) => {
    const { isbn } = params

    const book = await db.books.book.getEntireBookByISBN(isbn)
    if (!book) {
        error(HttpCodes.ClientError.NotFound, "Book Not Found")
    }

    const readingState = locals.user ?
        await db.auth.readingState.getBookReadingState(book.id, locals.user.id)
    : null

    const rating = locals.user ?
        await db.auth.rating.getUserRating(book.id, locals.user.id)
    : null

    const bookRating = locals.user ?
        await db.auth.rating.getBookAverageRating(book.id)
    : null

    const numberOfRatings = await db.auth.rating.getNumberOfRatings(book.id)

    const user = locals.user

    return {
        user,
        book,
        readingState,
        rating,
        bookRating,
        numberOfRatings
    }
}

const decoratedLoad = applyDecorators([
    ParseParamsDecorator({
        isbn: {
            schema: ISBNSchema,
            onError: () => error(HttpCodes.ClientError.BadRequest, "Invalid ISBN")
        }
    })
], load)

export { decoratedLoad as load }
