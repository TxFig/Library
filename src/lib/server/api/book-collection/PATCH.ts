import type { BookCollectionWithEntireBooks } from "$lib/server/database/books/collection"
import HttpCodes, { type HttpErrorCodesValues } from "$lib/utils/http-codes"
import type { Implements } from "$lib/utils/types"
import type { InternalApiMethodReturn } from ".."
import db from "$lib/server/database/"
import log, { logError } from "$lib/logging"


export type BookCollectionPatchMethodReturn = Implements<InternalApiMethodReturn, {
    success: true
    message: string,
    data: BookCollectionWithEntireBooks
} | {
    success: false
    code: HttpErrorCodesValues,
    message: string,
}>

export async function PATCH(collectionId: number, userId: number, name: string): Promise<BookCollectionPatchMethodReturn> {
    try {
        const doesUserOwnCollection = await db.books.collection.doesUserOwnCollection(collectionId, userId)
        if (!doesUserOwnCollection) {
            return {
                success: false,
                code: HttpCodes.ClientError.Unauthorized,
                message: "You do not own this collection"
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
