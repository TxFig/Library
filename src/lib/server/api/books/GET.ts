import db from "$lib/server/database/"
import { HttpCodes } from "$lib/utils/http-codes"
import type { Book } from "@prisma/client"
import type { ApiMethodReturn } from ".."
import { logError } from "$lib/server/database/logs"


export type BookGetMethodReturn = ApiMethodReturn<Book["publicId"][], undefined>
export const GET = async function(): Promise<BookGetMethodReturn> {
    try {
        const books = await db.books.book.getAll()
        return {
            data: books.map(book => book.publicId),
            success: true
        }
    } catch (err) {
        logError(err, "Error retrieving books")
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error retrieving books"
        }
    }
}


export default GET
