import HttpCodes, { type HttpErrorCodesValues } from "$lib/utils/http-codes"
import type { Implements } from "$lib/utils/types"
import type { InternalApiMethodReturn } from ".."
import db from "$lib/server/database/"
import type { ReadingStateUpdateData } from "$lib/validation/book/reading-state"


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

        return {
            message: "Successfully Updated Reading State",
            success: true,
            data: data
        }
    } catch (error) {
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error Updating Reading State"
        }
    }
}

export default PATCH
