import HttpCodes, { type HttpErrorCodesValues } from "$lib/utils/http-codes";
import type { UserCreateSchema } from "$lib/validation/auth/user";
import type { Infer, InferIn, SuperValidated } from "sveltekit-superforms";
import db from "$lib/server/database/";
import type { Implements } from "$lib/utils/types";
import type { InternalApiMethodReturn } from "..";
import type { EntireUser } from "$lib/server/database/auth/user";


export type SuperFormCreateUser = SuperValidated<
    Infer<UserCreateSchema>,
    App.Superforms.Message,
    InferIn<UserCreateSchema>
>

export type UserPostMethodReturn = Implements<InternalApiMethodReturn, {
    success: true
    message: string,
    data: EntireUser
} | {
    success: false
    code: HttpErrorCodesValues,
    message: string,
}>

export async function POST(form: SuperFormCreateUser, userId: number): Promise<UserPostMethodReturn> {
    const { data } = form

    const doesUserExist = await db.auth.user.doesUserExist({ email: data.email })
    if (doesUserExist) {
        return {
            code: HttpCodes.ClientError.Conflict,
            message: "User Already Exists",
            success: false
        }
    }

    try {
        const createdUser = await db.auth.user.createUser(data)

        return {
            message: "User Created Successfully",
            success: true,
            data: createdUser
        }
    } catch (err) {
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error creating user in database"
        }
    }
}

export default POST
