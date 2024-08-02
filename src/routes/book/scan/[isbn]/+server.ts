import { json, error } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { ISBNSchema } from "$lib/validation/book/isbn"
import { applyDecorators } from "$lib/decorators"
import { ParseParamsDecorator } from "$lib/decorators/parse-params"
import AuthDecorator from "$lib/decorators/auth"
import { fetchBookData } from "$lib/external-book-apis"


export const POST: RequestHandler = applyDecorators(
    [
        AuthDecorator(["Create Book"]),
        ParseParamsDecorator({
            isbn: {
                schema: ISBNSchema,
                onError: () => error(HttpCodes.ClientError.BadRequest, "Invalid ISBN")
            }
        })
    ],
    async ({ params, locals }) => {
        console.log("Scanning book...", Date.now())

        const { isbn } = params
        const userId = locals.user!.id

        const bookAlreadyExists = await db.books.book.doesBookExist(isbn)
        if (bookAlreadyExists) {
            error(HttpCodes.ClientError.Conflict, {
                message: "Book already exists in database.",
            })
        }

        const data = await fetchBookData(isbn)

        if (!data) {
            return json({
                message: "Book not available in external APIs."
            }, {
                status: HttpCodes.ClientError.NotFound
            })
        }

        try {
            await db.books.book.createBook(data)
            await db.activityLog.logActivity(userId, "BOOK_ADDED", data)

            return json({
                message: "Successfully Added Book"
            }, {
                status: HttpCodes.Success
            })
        } catch (error) {
            return json({
                message: "Error adding Book"
            }, {
                status: HttpCodes.ServerError.InternalServerError
            })
        }
    }
)
