import { ActionFailure, error, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"

import methods from "."


// Create Book
export const POST: RequestHandler = async ({ request }) => {
    let formData: FormData

    try {
        formData = await request.formData()
    } catch {
        throw error(HttpCodes.BadRequest, {
            message: "No Data Provided"
        })
    }

    const formError = await methods.POST(formData)
    if (formError instanceof ActionFailure) {
        throw error(formError.status, formError.data)
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
        throw error(HttpCodes.Unauthorized, {
            message: "Need to be logged in"
        })
    }

    const { isbn: isbnString } = params // TODO: get isbn from request body + fix code that uses this route to delete books to include the isbn in the request

    const isbn = Number(isbnString) // TODO: isbn validation

    await db.book.deleteBook(isbn)

    return json({ message: `Successfully deleted book, isbn ${isbnString}` })
}
