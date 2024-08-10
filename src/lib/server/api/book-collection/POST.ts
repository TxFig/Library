import type { BookCollectionWithBooks } from "$lib/server/database/books/collection";
import { HttpCodes, type HttpErrorCodesValues } from "$lib/utils/http-codes";
import type { Implements } from "$lib/utils/types";
import type { Infer, InferIn, SuperValidated } from "sveltekit-superforms";
import type { InternalApiMethodReturn } from "..";
import type { BookCollectionCreateSchema } from "$lib/validation/book-collection/collection";
import db from "$lib/server/database/"
import log, { logError } from "$lib/logging";


export type SuperFormCreateBookCollection = SuperValidated<
    Infer<BookCollectionCreateSchema>,
    App.Superforms.Message,
    InferIn<BookCollectionCreateSchema>
>

export type BookCollectionPostMethodReturn = Implements<InternalApiMethodReturn, {
    success: true
    message: string,
    data: BookCollectionWithBooks
} | {
    success: false
    code: HttpErrorCodesValues,
    message: string,
}>

export async function POST(form: SuperFormCreateBookCollection, userId: number): Promise<BookCollectionPostMethodReturn> {
    const { data } = form

    try {
        const isNameAvailable = await db.books.collection.isNameAvailable(data.name, userId)
        if (!isNameAvailable) {
            return {
                code: HttpCodes.ClientError.Conflict,
                message: "Collection Already Exists",
                success: false
            }
        }

        const createdBookCollection = await db.books.collection.createCollection(data.name, userId)
        await log("info", `Collection created: ${createdBookCollection.name}`, userId, data)
        return {
            message: "Collection Created Successfully",
            success: true,
            data: createdBookCollection
        }
    } catch (err) {
        await logError(err, `Error creating collection: ${data.name} in database`, userId)
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error Creating Collection"
        }
    }
}

export default POST
