import { json } from "@sveltejs/kit"
import db from "$lib/server/database/"
import clearEmptyFields from "$lib/utils/clear-empty-fields"
import { UserCreateSchema } from "$lib/validation/auth/user"
import type { UserWithPermissionGroup } from "$lib/server/database/auth"
import HttpCodes from "$lib/utils/http-codes"


//* Create User
export type POSTReturnType = {
    message: string
    user?: UserWithPermissionGroup
}

export const POST = async (data: any) => {
    try {
        const clearedData = clearEmptyFields(data)
        const parsedData = UserCreateSchema.parse(clearedData)

        const user = await db.auth.createUser({
            email: parsedData.email,
            username: parsedData.username,
            admin: false
        })
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

export default {
    POST
}
