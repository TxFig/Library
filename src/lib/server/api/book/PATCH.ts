import type { EntireBook } from "$lib/server/database/books/book";
import { HttpCodes, type HttpErrorCodesValues } from "$lib/utils/http-codes";
import type { Implements } from "$lib/utils/types";
import type { Infer, InferIn, SuperValidated } from "sveltekit-superforms";
import type { InternalApiMethodReturn } from "..";
import type { BookUpdateSchema } from "$lib/validation/book/book-form";
import db from "$lib/server/database/";


export type BookPatchMethodReturn = Implements<InternalApiMethodReturn, {
    success: true
    message: string,
    data: EntireBook,
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

    const doesBookExist = await db.books.book.doesBookExist(data.isbn)
    if (!doesBookExist) {
        return {
            success: false,
            code: HttpCodes.ClientError.NotFound,
            message: "Book Not Found"
        }
    }

    try {
        const book = await db.books.book.updateBook(data)
        await db.activityLog.logActivity(userId, "BOOK_UPDATED", data)

        return {
            success: true,
            message: "Book Updated Successfully",
            data: book
        }
    } catch {
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error updating book in database"
        }
    }
}

export default PATCH
