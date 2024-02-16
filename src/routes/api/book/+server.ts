import { error, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { HttpError } from "$lib/utils/custom-errors"

import methods from "."
import { ISBNOptionalSchema, ISBNSchema, parseISBN, parseOptionalISBN } from "$lib/validation/isbn"
import { getFormattedError } from "$lib/validation/format-errors"
import type { SafeParseError, SafeParseSuccess } from "zod"


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
export const GET: RequestHandler = async ({ url }) => {
    const isbnString = url.searchParams.get("isbn")
    let isbn: bigint | null | undefined

    try {
        isbn = parseOptionalISBN(isbnString)
    } catch (err) {
        if (err instanceof HttpError) {
            error(err.httpCode, err.message)
        }
    }

    if (isbn) {
        const book = await db.book.getEntireBookByISBN(isbn) // todo try/catch
        if (!book) {
            error(HttpCodes.ClientError.NotFound, { message: "Book Not Found" })
        }
        return json(book)
    }

    const allBooks = await db.book.getAllBooks() // todo try/catch
    return json(allBooks)
}

// Update Book
export const PATCH: RequestHandler = async ({ request }) => {
    let formData: FormData

    try {
        formData = await request.formData()
    } catch {
        error(HttpCodes.ClientError.BadRequest, {
            message: "No Data Provided"
        })
    }

    try {
        await methods.PATCH(formData)
    }
    catch (err) {
        if (err instanceof HttpError) {
            error(err.httpCode, err.message)
        }
    }

    return json({
        message: "Successfully Updated Book"
    }, {
        status: HttpCodes.Success
    })
}

// Delete Book
export const DELETE: RequestHandler = async ({ url, locals }) => {
    if (!locals.user) {
        error(HttpCodes.ClientError.Unauthorized, {
            message: "Need to be logged in"
        })
    }

    const isbnString = url.searchParams.get("isbn")
    let isbn: bigint

    try {
        isbn = parseISBN(isbnString)
    } catch (err) {
        if (err instanceof HttpError) {
            error(err.httpCode, err.message)
        }
    }

    try {
        await db.book.deleteBook(isbn!)
    } catch (err) {
        error(HttpCodes.ServerError.InternalServerError, {
            message: "Error deleting book in database"
        })
    }

    return json({ message: `Successfully deleted book, isbn ${isbnString}` })
}
