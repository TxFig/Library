import { json, error } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

import { getOpenLibraryBook } from "$lib/utils/open-library"
import db from "$lib/server/database/"
import HttpErrors from "$lib/utils/http-errors"


export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        throw error(HttpErrors.Unauthorized, {
            message: "Need to be logged in"
        })
    }

    const { isbn: isbnString }: { isbn: string } = await request.json()

    const isbn = Number(isbnString)

    const bookAlreadyExists = await db.book.doesBookExist(isbn)
    if (bookAlreadyExists) {
        throw error(HttpErrors.Conflict, {
            message: "Book already exists in database.",
        })
    }

    const insertData = await getOpenLibraryBook(isbnString)
    if (!insertData) {
        throw error(HttpErrors.NotFound, {
            message: "Book not available in OpenLibrary.",
        })
    }

    db.book.createBook(insertData)
    return json({ message: "Successfully added Book" })
}
