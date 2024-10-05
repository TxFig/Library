import type { BookCollectionWithBooks } from "$lib/server/database/books/types"
import HttpCodes, { type HttpErrorCodesValues } from "$lib/utils/http-codes"
import type { Implements } from "$lib/utils/types"
import type { InternalApiMethodReturn } from ".."
import db from "$lib/server/database/"
import log, { logError } from "$lib/logging"


export type BookCollectionPatchMethodReturn = Implements<InternalApiMethodReturn, {
    success: true
    message: string,
    data: BookCollectionWithBooks
} | {
    success: false
    code: HttpErrorCodesValues,
    message: string,
}>

export async function PATCH(collectionId: number, userId: number, name: string): Promise<BookCollectionPatchMethodReturn> {
    try {
        const collection = await db.books.collection.getCollectionById(collectionId)
        if (!collection) {
            return {
                success: false,
                code: HttpCodes.ClientError.Unauthorized,
                message: "Collection does not exist"
            }
        }
        const data = await db.books.collection.updateCollection(collectionId, userId, name)
        await log("info", `Collection updated: ${collectionId}`, userId, data)
        return {
            message: "Successfully Updated Book Collection",
            success: true,
            data: data
        }
    } catch (error) {
        await logError(error, `Error updating collection: ${collectionId} in database`, userId)
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error Updating Book Collection"
        }
    }
}

export default PATCH
