import type { HttpErrorCodesValues } from "$lib/utils/http-codes";
import type { Implements } from "$lib/utils/types";
import type { RatingUpdateData } from "$lib/validation/book/rating";
import type { InternalApiMethodReturn } from "..";
import db from "$lib/server/database/";
import log, { logError } from "$lib/logging";


export type RatingPatchMethodReturn = Implements<InternalApiMethodReturn, {
    success: true
    message: string,
    data: number
} | {
    success: false
    code: HttpErrorCodesValues,
    message: string,
}>

export async function PATCH(data: RatingUpdateData, userId: number): Promise<RatingPatchMethodReturn> {
    try {
        await db.auth.rating.updateUserRating(data.bookId, userId, data.rating)
        await log("info", `User updated rating for book (${data.bookId}): ${data.rating}`, userId, data)

        return {
            message: "Successfully Updated Rating",
            success: true,
            data: data.rating
        }
    } catch (err) {
        await logError(err, `Error updating rating for book: ${data.bookId}`, userId)
        return {
            success: false,
            code: 500,
            message: "Error Updating Rating"
        }
    }
}

export default PATCH
