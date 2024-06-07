import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { parseISBN } from "$lib/validation/isbn"
import { HttpError } from "$lib/utils/custom-errors"


export const load: PageServerLoad = async ({ params, locals }) => {
    const { isbn: isbnString } = params

    let isbn: bigint
    try {
        isbn = parseISBN(isbnString)
    } catch (err) {
        if (err instanceof HttpError) error(err.httpCode, err.message)
        else error(HttpCodes.ServerError.InternalServerError, "Internal Server Error")
    }

    const book = await db.book.getEntireBookByISBN(isbn)
    if (!book) {
        error(HttpCodes.ClientError.NotFound, "Book Not Found")
    }

    const readingState = locals.user ?
        await db.auth.readingState.getBookReadingState(isbn, locals.user.id)
    : null

    return { book, readingState }
}
