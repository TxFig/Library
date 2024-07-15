import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { ISBNSchema } from "$lib/validation/book/isbn"


export const load: PageServerLoad = async ({ params, locals }) => {
    const { isbn: rawISBN } = params

    let isbn: string
    try {
        isbn = ISBNSchema.parse(rawISBN)
    } catch {
        error(HttpCodes.ClientError.BadRequest, "Invalid ISBN")
    }

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
