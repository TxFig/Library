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
import { ParseParamsDecorator } from "$lib/decorators/parse-params"


const ISBNParamSchema = {
    schema: ISBNSchema,
    onError: () => json({
        message: "Invalid ISBN"
    }, {
        status: HttpCodes.ClientError.BadRequest
    })
}

export const GET: RequestHandler = applyDecorators(
    [AuthDecorator(["View Book"]), ParseParamsDecorator({ isbn: ISBNParamSchema })],
    async ({ params }) => {
        const methodReturn = await API.book.GET(params.isbn)
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
    [AuthDecorator(["Edit Book"]), ParseParamsDecorator({ isbn: ISBNParamSchema })],
    async ({ request, locals, params }) => {
        const formData = await request.formData()
        const userId = locals.user!.id
        const form = await superValidate(formData, zod(BookUpdateSchema))

        if (!form.valid) {
            return json({
                message: "Invalid Form Data",
                errors: form.errors
            }, {
                status: HttpCodes.ClientError.BadRequest
            })
        }

        form.data.isbn = params.isbn
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
    [AuthDecorator(["Delete Book"]), ParseParamsDecorator({ isbn: ISBNParamSchema })],
    async ({ locals, params }) => {
        const userId = locals.user!.id

        try {
            await db.books.book.deleteBook(params.isbn)
            await db.activityLog.logActivity(userId, "BOOK_DELETED", {
                isbn: params.isbn
            })
        } catch (err) {
            return json({
                message: "Error deleting book in database"
            }, {
                status: HttpCodes.ServerError.InternalServerError
            })
        }

        return json({ message: `Successfully deleted book, isbn ${params.isbn}` })
    }
)
