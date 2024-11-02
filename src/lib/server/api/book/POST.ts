import log, { logError } from "$lib/logging"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import type { BookCreateSchema } from "$lib/validation/book/book"
import type { Book } from "@prisma/client"
import type { RequestEvent } from "."
import type { FormEndpointFunction } from "../endpoint"
import type { ApiMethodReturn } from ".."


type ReturnData = Book
export type BookPostMethodReturn = ApiMethodReturn<ReturnData>
export const POST: FormEndpointFunction<RequestEvent, BookCreateSchema, Book> = async function(_, form) {
    const { data } = form

    try {
        const book = await db.books.book.create(data)
        // await log("info", `Book created: ${book.publicId}`, userId, data)
        await log("info", `Book created: ${book.publicId}`, undefined, data)

        return {
            message: "Book Created Successfully",
            success: true,
            data: book
        }
    } catch (err) {
        // await logError(err, `Error creating book: ${data["edition.title"]} in database`, userId)
        await logError(err, `Error creating book: ${data["edition.title"]} in database`)
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error creating book in database"
        }
    }
}


export default POST
