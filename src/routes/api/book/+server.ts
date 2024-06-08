import { error, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { HttpError } from "$lib/utils/custom-errors"

import methods from "."
import { parseISBN, parseOptionalISBN } from "$lib/validation/isbn"
import type { EntireBook } from "$lib/server/database/book"
import type { Book } from "@prisma/client"
import { hasPermission } from "$lib/utils/permissions"


// Create Book
export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user || !hasPermission(locals.user, "Create Book")) {
        error(HttpCodes.ClientError.Unauthorized, {
            message: "Need to be logged in to create books"
        })
    }

    let formData: FormData

    try {
        formData = await request.formData()
    } catch {
        error(HttpCodes.ClientError.BadRequest, {
            message: "No Data Provided"
        })
    }

    try {
        await methods.POST(locals.user, formData)
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
    let isbn: string | null | undefined

    try {
        isbn = parseOptionalISBN(isbnString)
    } catch (err) {
        if (err instanceof HttpError) {
            error(err.httpCode, err.message)
        }
    }

    if (isbn) {
        let book: EntireBook | null
        try {
            book = await db.book.getEntireBookByISBN(isbn)
        } catch (err) {
            error(HttpCodes.ServerError.InternalServerError, {
                message: `Error retrieving book (isbn = ${isbn}) from database`
            })
        }
        if (!book) {
            error(HttpCodes.ClientError.NotFound, {
                message: "Book Not Found"
            })
        }
        return json(book)
    }

    let allBooks: Book[]
    try {
        allBooks = await db.book.getAllBooks()
    } catch (err) {
        error(HttpCodes.ServerError.InternalServerError, {
            message: "Error retrieving all books from database"
        })
    }
    return json(allBooks)
}

// Update Book
export const PATCH: RequestHandler = async ({ request, locals }) => {
    if (!locals.user || !hasPermission(locals.user, "Edit Book")) {
        error(HttpCodes.ClientError.Unauthorized, {
            message: "Need to be logged in to edit books"
        })
    }

    let formData: FormData

    try {
        formData = await request.formData()
    } catch {
        error(HttpCodes.ClientError.BadRequest, {
            message: "No Data Provided"
        })
    }

    try {
        await methods.PATCH(locals.user, formData)
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
    if (!locals.user || !hasPermission(locals.user, "Delete Book")) {
        error(HttpCodes.ClientError.Unauthorized, {
            message: "Need to be logged in"
        })
    }

    const isbnString = url.searchParams.get("isbn")
    let isbn: string

    try {
        isbn = parseISBN(isbnString)
    } catch (err) {
        if (err instanceof HttpError) {
            error(err.httpCode, err.message)
        }
    }

    try {
        await db.book.deleteBook(isbn!)
        await db.activityLog.logActivity(locals.user.id, "BOOK_DELETED", {
            isbn: isbn!
        })
    } catch (err) {
        error(HttpCodes.ServerError.InternalServerError, {
            message: "Error deleting book in database"
        })
    }

    return json({ message: `Successfully deleted book, isbn ${isbnString}` })
}
