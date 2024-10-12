import { HttpCodes, type HttpErrorCodesValues } from "$lib/utils/http-codes";
import type { Implements } from "$lib/utils/types";
import type { Infer, InferIn, SuperValidated } from "sveltekit-superforms";
import type { InternalApiMethodReturn } from "..";
import type { BookUpdateSchema } from "$lib/validation/book/_book";
import db from "$lib/server/database/";
import log, { logError } from "$lib/logging";
import type { Book } from "@prisma/client";


export type BookPatchMethodReturn = Implements<InternalApiMethodReturn, {
    success: true
    message: string,
    data: Book,
} | {
    success: false,
    code: HttpErrorCodesValues,
    message: string
}>

export type SuperFormUpdateBook = SuperValidated<
    Infer<BookUpdateSchema>,
    App.Superforms.Message,
    InferIn<BookUpdateSchema>
>

export async function PATCH(form: SuperFormUpdateBook, userId: number): Promise<BookPatchMethodReturn> {
    const { data } = form

    const doesBookExist = await db.books.book.doesBookExist({ isbn: data.isbn })
    if (!doesBookExist) {
        return {
            success: false,
            code: HttpCodes.ClientError.NotFound,
            message: "Book Not Found"
        }
    }

    try {
        const book = await db.books.book.updateBook(data)
        await log("info", `Book updated: ${book.isbn}`, userId, data)

        return {
            success: true,
            message: "Book Updated Successfully",
            data: book
        }
    } catch (err) {
        await logError(err, `Error updating book: ${data.isbn} in database`, userId)
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error updating book in database"
        }
    }
}

export default PATCH
