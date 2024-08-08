import type { EntireUser } from "$lib/server/database/auth/user"
import { HttpCodes, type HttpErrorCodesValues } from "$lib/utils/http-codes"
import type { Implements } from "$lib/utils/types"
import type { InternalApiMethodReturn } from ".."
import db from "$lib/server/database/"


export type UserDeleteMethodReturn = Implements<InternalApiMethodReturn, {
    success: true
    message: string,
    data: EntireUser,
} | {
    success: false,
    code: HttpErrorCodesValues,
    message: string,
}>

export async function DELETE(opaqueId: string, userId: number): Promise<UserDeleteMethodReturn> {
    try {
        const user = await db.auth.user.deleteUser(opaqueId)

        return {
            message: "User Deleted Successfully",
            success: true,
            data: user
        }
    } catch (err) {
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error deleting user in database"
        }
    }
}

export default DELETE
