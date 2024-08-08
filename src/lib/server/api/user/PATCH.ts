import { HttpCodes, type HttpErrorCodesValues } from "$lib/utils/http-codes";
import type { Implements } from "$lib/utils/types";
import type { Infer, InferIn, SuperValidated } from "sveltekit-superforms";
import type { InternalApiMethodReturn } from "..";
import db from "$lib/server/database/";
import type { EntireUser } from "$lib/server/database/auth/user";
import type { UserUpdateSchema } from "$lib/validation/auth/user";


export type UserPatchMethodReturn = Implements<InternalApiMethodReturn, {
    success: true
    message: string,
    data: EntireUser,
} | {
    success: false,
    code: HttpErrorCodesValues,
    message: string
}>

export type SuperFormUpdateUser = SuperValidated<
    Infer<UserUpdateSchema>,
    App.Superforms.Message,
    InferIn<UserUpdateSchema>
>

export async function PATCH(form: SuperFormUpdateUser, opaqueId: string, userId: number): Promise<UserPatchMethodReturn> {
    const { data } = form

    const doesUserExist = await db.auth.user.doesUserExist({ opaqueId })
    if (!doesUserExist) {
        return {
            success: false,
            code: HttpCodes.ClientError.NotFound,
            message: "User Not Found"
        }
    }

    try {
        const user = await db.auth.user.updateUser(opaqueId, data)

        return {
            success: true,
            message: "User Updated Successfully",
            data: user
        }
    } catch {
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error updating user in database"
        }
    }
}

export default PATCH
