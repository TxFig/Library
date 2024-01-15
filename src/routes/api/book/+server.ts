import { error, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { HttpError } from "$lib/utils/custom-errors"

import methods from "."


// Create Book
export const POST: RequestHandler = async ({ request }) => {
    let formData: FormData

    try {
        formData = await request.formData()
    } catch {
        error(HttpCodes.ClientError.BadRequest, {
            message: "No Data Provided"
        })
    }

    try {
        await methods.POST(formData)
    }
    catch (err) {
        if (err instanceof HttpError) {
            error(err.httpCode, err.message)
        }
    }

    return json({
        message: "Successfully Created Book"
    }, {
        status: HttpCodes.Success
    })
}


// Retrieve Book
export const GET: RequestHandler = async ({}) => {
    return new Response()
}

// Update Book
export const PATCH: RequestHandler = async ({}) => {
    return new Response()
}

// Delete Book
export const DELETE: RequestHandler = async ({ params, locals }) => {
    if (!locals.user) {
        error(HttpCodes.Unauthorized, {
            message: "Need to be logged in"
        })
    }

    const { isbn: isbnString } = params // TODO: get isbn from request body + fix code that uses this route to delete books to include the isbn in the request

    const isbn = Number(isbnString) // TODO: isbn validation

    await db.book.deleteBook(isbn)

    return json({ message: `Successfully deleted book, isbn ${isbnString}` })
}
