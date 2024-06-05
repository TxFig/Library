import { json } from "@sveltejs/kit"
import db from "$lib/server/database/"
import clearEmptyFields from "$lib/utils/clear-empty-fields"
import { UserCreateSchema } from "$lib/validation/auth/user"
import type { EntireUser } from "$lib/server/database/auth"
import HttpCodes from "$lib/utils/http-codes"
import { z } from "zod"


//* Create User
export type ResponseType = {
    message: string
    user?: EntireUser
}

export const POST = async (data: any) => {
    try {
        const clearedData = clearEmptyFields(data)
        const parsedData = UserCreateSchema.parse(clearedData)

        const user = await db.auth.createUser({ ...parsedData })
        return json({
            user,
            message: "Successfully Created User"
        }, {
            status: HttpCodes.Success
        })
    } catch (error) {
        return json({
            message: "Error Creating User"
        }, {
            status: HttpCodes.ClientError.BadRequest
        })
    }
}

export const DELETE = async (userId: string) => {
    try {
        const parsedId = z.coerce.number().parse(userId)
        const user = await db.auth.deleteUser(parsedId)
        return json({
            user,
            message: "Successfully Deleted User"
        }, {
            status: HttpCodes.Success
        })
    } catch (error) {
        return json({
            message: "Error Deleting User"
        }, {
            status: HttpCodes.ClientError.BadRequest
        })
    }
}


export default {
    POST,
    DELETE
}
