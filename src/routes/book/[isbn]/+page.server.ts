import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

import db from "$lib/server/database/"
import HttpErrors from "$lib/utils/http-errors"


export const load: PageServerLoad = async ({ params, locals }) => {
    const { isbn: isbnString } = params
    const isbn = Number(isbnString) // TODO: validate isbn integer / not NaN

    const book = await db.book.getEntireBookByISBN(isbn)

    if (!book) {
        throw error(HttpErrors.NotFound, "Book Not Available")
    }

    const readingState = locals.user ? await db.auth.getBookReadingState(isbn, locals.user.id) : null

    return { book, readingState }
}
