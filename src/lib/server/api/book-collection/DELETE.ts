import { HttpCodes, type HttpErrorCodesValues } from "$lib/utils/http-codes";
import type { Implements } from "$lib/utils/types";
import type { InternalApiMethodReturn } from "..";
import db from "$lib/server/database/"


export type BookCollectionDeleteMethodReturn = Implements<InternalApiMethodReturn, {
    success: true
    message: string,
    data: undefined
} | {
    success: false
    code: HttpErrorCodesValues,
    message: string,
}>

export async function DELETE(collectionId: number, userId: number): Promise<BookCollectionDeleteMethodReturn> {
    try {
        await db.books.collection.deleteCollection(collectionId, userId)
        return {
            message: "Collection Deleted Successfully",
            success: true,
            data: undefined
        }
    } catch (err) {
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error Deleting Collection"
        }
    }
}

export default DELETE
