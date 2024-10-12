import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { PublicIdSchema } from "$lib/validation/book/publicId"
import { applyDecorators } from "$lib/decorators"
import { ParseParamsDecorator } from "$lib/decorators/parse-params"
import { DisplayBookInclude } from "$lib/server/database/books/types"


const load: PageServerLoad = async ({ params, locals }) => {
    const { bookPublicId, editionPublicId } = params

    const book = await db.books.book.getUniqueBook({
        where: { publicId },
        include: DisplayBookInclude
    })
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
        publicId: {
            schema: PublicIdSchema,
            onError: () => error(HttpCodes.ClientError.BadRequest, "Invalid Public Id")
        }
    })
], load)

export { decoratedLoad as load }
