import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"


export const load: PageServerLoad = async ({ params, locals }) => {
    const { isbn: isbnString } = params
    const isbn = Number(isbnString) // TODO: validate isbn integer / not NaN

    const book = await db.book.getEntireBookByISBN(isbn)

    if (!book) {
        throw error(HttpCodes.NotFound, "Book Not Available")
    }

    const readingState = locals.user ? await db.auth.getBookReadingState(isbn, locals.user.id) : null

    return { book, readingState }
}
