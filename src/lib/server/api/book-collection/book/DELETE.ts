import { HttpCodes, type HttpErrorCodesValues } from "$lib/utils/http-codes";
import type { Implements } from "$lib/utils/types";
import type { InternalApiMethodReturn } from "../..";
import db from "$lib/server/database/"
import log, { logError } from "$lib/logging";


export type BookCollectionAddBookDeleteMethodReturn = Implements<InternalApiMethodReturn, {
    success: true
    message: string,
    data: undefined
} | {
    success: false
    code: HttpErrorCodesValues,
    message: string,
}>

export async function DELETE(userId: number, collectionName: string, isbn: string): Promise<BookCollectionAddBookDeleteMethodReturn> {
    try {
        const collection = await db.books.collection.getCollectionByName(collectionName)
        if (!collection) {
            return {
                success: false,
                code: HttpCodes.ClientError.BadRequest,
                message: "Collection does not exist"
            }
        }

        const doesUserOwnCollection = await db.books.collection.doesUserOwnCollection(collection.id, userId)
        if (!doesUserOwnCollection) {
            return {
                success: false,
                code: HttpCodes.ClientError.Unauthorized,
                message: "You do not own this collection"
            }
        }

        const doesCollectionHaveBook = await db.books.collection.doesCollectionHaveBook(collection.id, isbn)
        if (!doesCollectionHaveBook) {
            return {
                success: false,
                code: HttpCodes.ClientError.Conflict,
                message: "Book does not exist in collection"
            }
        }

        await db.books.collection.removeBookFromCollection(collection.id, isbn)
        await log("info", `Book (${isbn}) removed from collection: ${collection.id}`, userId)
        return {
            message: "Book Removed Successfully",
            success: true,
            data: undefined
        }
    } catch (err) {
        await logError(err, `Error removing book: ${isbn} from collection: ${collectionName} in database`, userId)
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error Removing Book"
        }
    }
}

export default DELETE
