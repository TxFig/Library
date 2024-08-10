import HttpCodes, { type HttpErrorCodesValues } from "$lib/utils/http-codes"
import type { Implements } from "$lib/utils/types"
import type { InternalApiMethodReturn } from ".."
import db from "$lib/server/database/"
import type { ReadingStateUpdateData } from "$lib/validation/book/reading-state"
import log, { logError } from "$lib/logging"


export type ReadingStatePatchMethodReturn = Implements<InternalApiMethodReturn, {
    success: true
    message: string,
    data: ReadingStateUpdateData
} | {
    success: false
    code: HttpErrorCodesValues,
    message: string,
}>

export async function PATCH(data: ReadingStateUpdateData, userId: number): Promise<ReadingStatePatchMethodReturn> {
    try {
        await db.auth.readingState.updateUserReadingState(data.bookId, userId, data.state)
        await log("info", `User (${userId}) updated reading state for book: ${data.bookId}`, userId, data)

        return {
            message: "Successfully Updated Reading State",
            success: true,
            data: data
        }
    } catch (err) {
        await logError(err, `Error updating reading state for book: ${data.bookId}`, userId)
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error Updating Reading State"
        }
    }
}

export default PATCH
