import { json, error } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

import { getOpenLibraryBook } from "$lib/utils/open-library"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { parseISBN } from "$lib/validation/isbn"
import { HttpError } from "$lib/utils/custom-errors"


export const POST: RequestHandler = async ({ params, locals }) => {
    if (!locals.user) {
        error(HttpCodes.ClientError.Unauthorized, {
            message: "Need to be logged in"
        })
    }
    const { isbn: isbnString } = params
    let isbn: bigint
    try {
        isbn = parseISBN(isbnString)
    } catch (err) {
        if (err instanceof HttpError) error(err.httpCode, err.message)
        else error(HttpCodes.ServerError.InternalServerError, "Internal Server Error")
    }

    const bookAlreadyExists = await db.book.doesBookExist(isbn)
    if (bookAlreadyExists) {
        error(HttpCodes.ClientError.Conflict, {
            message: "Book already exists in database.",
        })
    }

    const insertData = await getOpenLibraryBook(isbnString)
    if (!insertData) {
        error(HttpCodes.ClientError.NotFound, {
            message: "Book not available in OpenLibrary.",
        })
    }

    try {
        await db.book.createBook(insertData)
        return json({
            status: 200,
            message: "Successfully added Book"
        })
    } catch (error) {
        return json({
            status: 500,
            message: "Error adding Book"
        })
    }
}
