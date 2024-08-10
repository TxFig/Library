import { json, error } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { ISBNSchema } from "$lib/validation/book/isbn"
import { applyDecorators } from "$lib/decorators"
import { ParseParamsDecorator } from "$lib/decorators/parse-params"
import AuthDecorator from "$lib/decorators/auth"
import { fetchBookData } from "$lib/external-book-apis"
import log, { logError } from "$lib/logging"


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
        const { isbn } = params
        const userId = locals.user!.id

        const bookAlreadyExists = await db.books.book.doesBookExist(isbn)
        if (bookAlreadyExists) {
            error(HttpCodes.ClientError.Conflict, {
                message: "Book already exists in database.",
            })
        }

        try {

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
                await log("info", `Book created: ${isbn}`, userId, data)

                return json({
                    message: "Successfully Added Book"
                }, {
                    status: HttpCodes.Success
                })
            } catch (err) {
                await logError(err, `Error creating book: ${isbn} in database`, userId)
                return json({
                    message: "Error adding Book"
                }, {
                    status: HttpCodes.ServerError.InternalServerError
                })
            }
        }
        catch (err) {
            logError(err, `Error fetching book data for: ${isbn}`, userId)
            return json({
                message: "Error fetching book data"
            }, {
                status: HttpCodes.ServerError.InternalServerError
            })
        }
    }
)
