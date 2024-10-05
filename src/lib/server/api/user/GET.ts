import { HttpCodes, type HttpErrorCodesValues } from "$lib/utils/http-codes"
import type { Implements } from "$lib/utils/types"
import type { InternalApiMethodReturn } from ".."

import db from "$lib/server/database/"
import type { User } from "@prisma/client"


type UserGetMethodReturn = Implements<InternalApiMethodReturn, {
    data: User | User[],
    success: true
} | {
    success: false
    code: HttpErrorCodesValues
    message: string
}>

export async function GET(opaqueId?: string): Promise<UserGetMethodReturn> {
    try {
        if (opaqueId) {
            const user = await db.auth.user.getUniqueUser({ where: { opaqueId } })
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
        const users = await db.auth.user.getUsers()
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
