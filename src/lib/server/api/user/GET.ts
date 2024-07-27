import type { EntireUser } from "$lib/server/database/auth/user"
import { HttpCodes, type HttpErrorCodesValues } from "$lib/utils/http-codes"
import type { Implements } from "$lib/utils/types"
import type { InternalApiMethodReturn } from ".."

import db from "$lib/server/database/"


type UserGetMethodReturn = Implements<InternalApiMethodReturn, {
    data: EntireUser | EntireUser[],
    success: true
} | {
    success: false
    code: HttpErrorCodesValues
    message: string
}>

export async function GET(opaqueId?: string): Promise<UserGetMethodReturn> {
    try {
        if (opaqueId) {
            const user = await db.auth.user.getEntireUserByOpaqueId(opaqueId)
            if (user) {
                return {
                    data: user,
                    success: true
                }
            }
            return {
                success: false,
                code: HttpCodes.ClientError.NotFound,
                message: "User Not Found"
            }
        }
        const users = await db.auth.user.getAllUsers()
        return {
            data: users,
            success: true
        }
    }
    catch {
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error retrieving user(s)"
        }
    }
}

export default GET
