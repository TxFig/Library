import { applyDecorators } from "$lib/decorators"
import AuthDecorator from "$lib/decorators/auth"
import API from "$lib/server/api"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import HttpCodes from "$lib/utils/http-codes"
import { ISBNSchema } from "$lib/validation/book/isbn"
import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"
import { BookUpdateSchema } from "$lib/validation/book/book-form"
import db from "$lib/server/database/"


export const GET: RequestHandler = applyDecorators(
    [AuthDecorator(["View Book"])],
    async ({ params }) => {
        const rawISBN = params.isbn

        let isbn: string
        try {
            isbn = ISBNSchema.parse(rawISBN)
        } catch {
            return json({
                message: "Invalid ISBN"
            }, {
                status: HttpCodes.ClientError.BadRequest
            })
        }

        const methodReturn = await API.book.GET(isbn)
        if (methodReturn.success) {
            return json(methodReturn.data, {
                status: HttpCodes.Success
            })
        } else {
            return json({
                message: methodReturn.message
            }, {
                status: methodReturn.code
            })
        }
    }
)

export const PATCH: RequestHandler = applyDecorators(
    [AuthDecorator(["Edit Book"])],
    async ({ request, locals, params }) => {
        const formData = await request.formData()
        const userId = locals.user!.id
        const form = await superValidate(formData, zod(BookUpdateSchema))

        const rawISBN = params.isbn
        let isbn: string
        try {
            isbn = ISBNSchema.parse(rawISBN)
        } catch {
            return json({
                message: "Invalid ISBN"
            }, {
                status: HttpCodes.ClientError.BadRequest
            })
        }

        if (!form.valid) {
            return json({
                message: "Invalid Form Data",
                errors: form.errors
            }, {
                status: HttpCodes.ClientError.BadRequest
            })
        }

        form.data.isbn = isbn
        const methodReturn = await API.book.PATCH(form, userId)
        if (methodReturn.success) {
            return json({
                message: methodReturn.message,
                data: methodReturn.data
            }, {
                status: HttpCodes.Success
            })
        } else {
            return json({
                message: methodReturn.message
            }, {
                status: methodReturn.code
            })
        }
    }
)

export const DELETE: RequestHandler = applyDecorators(
    [AuthDecorator(["Delete Book"])],
    async ({ locals, params }) => {
        const userId = locals.user!.id
        const rawISBN = params.isbn
        let isbn: string
        try {
            isbn = ISBNSchema.parse(rawISBN)
        } catch {
            return json({
                message: "Invalid ISBN"
            }, {
                status: HttpCodes.ClientError.BadRequest
            })
        }

        try {
            await db.books.book.deleteBook(isbn)
            await db.activityLog.logActivity(userId, "BOOK_DELETED", {
                isbn: isbn
            })
        } catch (err) {
            return json({
                message: "Error deleting book in database"
            }, {
                status: HttpCodes.ServerError.InternalServerError
            })
        }

        return json({ message: `Successfully deleted book, isbn ${isbn}` })
    }
)
