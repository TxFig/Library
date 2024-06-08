import { json } from "@sveltejs/kit"
import db from "$lib/server/database/"
import clearEmptyFields from "$lib/utils/clear-empty-fields"
import { UserCreateSchema, UserUpdateSchema } from "$lib/validation/auth/user"
import type { EntireUser } from "$lib/server/database/auth/user"
import HttpCodes from "$lib/utils/http-codes"
import { z } from "zod"


//* Create User
export type ResponseType = {
    message: string
    user?: EntireUser
}

export const POST = async (user: EntireUser, data: any) => {
    try {
        const clearedData = clearEmptyFields(data)
        const parsedData = UserCreateSchema.parse(clearedData)

        const createdUser = await db.auth.user.createUser({ ...parsedData })

        await db.activityLog.logActivity(user.id, "USER_CREATED", parsedData)

        return json({
            user: createdUser,
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

export const DELETE = async (user: EntireUser, userId: string) => {
    try {
        const parsedId = z.coerce.number().parse(userId)
        const deletedUser = await db.auth.user.deleteUser(parsedId)

        await db.activityLog.logActivity(user.id, "USER_DELETED", {
            userId: deletedUser.id
        })

        return json({
            user: deletedUser,
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

export const PATCH = async (user: EntireUser, userId: string, data: any) => {
    try {
        const clearedData = clearEmptyFields(data)
        const parsedData = UserUpdateSchema.parse(clearedData)

        const parsedId = z.coerce.number().parse(userId)
        const updatedUser = await db.auth.user.updateUser(parsedId, parsedData)

        await db.activityLog.logActivity(user.id, "USER_UPDATED", parsedData)

        return json({
            user: updatedUser,
            message: "Successfully Updated User"
        }, {
            status: HttpCodes.Success
        })
    } catch (error) {
        return json({
            message: "Error Updating User"
        }, {
            status: HttpCodes.ClientError.BadRequest
        })
    }
}


export default {
    POST,
    DELETE,
    PATCH
}
