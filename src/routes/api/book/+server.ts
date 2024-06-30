import { applyDecorators } from "$lib/decorators";
import AuthDecorator from "$lib/decorators/auth";
import type { RequestHandler } from "./$types";
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { json } from "@sveltejs/kit";


export const GET: RequestHandler = applyDecorators(
    [AuthDecorator(["View Book"])],
    async () => {
        try {
            const books = await db.books.book.getAllBooks()
            return json(books, {
                status: HttpCodes.Success
            })
        } catch (err) {
            return json({
                message: "Error retrieving books"
            }, {
                status: HttpCodes.ServerError.InternalServerError
            })
        }
    }
)

export const POST: RequestHandler = applyDecorators(
    [AuthDecorator(["Create Book"])],
    async ({ request }) => {
        try {
            const formData = await request.formData()


            return new Response()
        } catch (err) {
            return json({
                message: "Error creating book"
            }, {
                status: HttpCodes.ServerError.InternalServerError
            })
        }
    }
)
