// import { HttpCodes, type HttpErrorCodesValues } from "$lib/utils/http-codes";
// import type { Implements } from "$lib/utils/types";
// import type { Infer, InferIn, SuperValidated } from "sveltekit-superforms";
// import type { ApiMethodReturn } from "..";
// import db from "$lib/server/database/";
// import type { UserUpdateSchema } from "$lib/_validation/auth/user";
// import { log, logError } from "$lib/server/database/logs";
// import type { User } from "@prisma/client";


// export type UserPatchMethodReturn = Implements<ApiMethodReturn, {
//     success: true
//     message: string,
//     data: User,
// } | {
//     success: false,
//     code: HttpErrorCodesValues,
//     message: string
// }>

// export type SuperFormUpdateUser = SuperValidated<
//     Infer<UserUpdateSchema>,
//     App.Superforms.Message,
//     InferIn<UserUpdateSchema>
// >

// export async function PATCH(form: SuperFormUpdateUser, opaqueId: string, userId: number): Promise<UserPatchMethodReturn> {
//     const { data } = form

//     const doesUserExist = await db.auth.user.getCount({ where: { opaqueId } }) !== 0
//     if (!doesUserExist) {
//         return {
//             success: false,
//             code: HttpCodes.ClientError.NotFound,
//             message: "User Not Found"
//         }
//     }

//     try {
//         const user = await db.auth.user.updateUser(opaqueId, data)
//         await log("info", `User updated: ${user.id}`, userId, data)

//         return {
//             success: true,
//             message: "User Updated Successfully",
//             data: user
//         }
//     } catch (err) {
//         await logError(err, `Error updating user: ${opaqueId} in database`, userId)
//         return {
//             success: false,
//             code: HttpCodes.ServerError.InternalServerError,
//             message: "Error updating user in database"
//         }
//     }
// }

// export default PATCH
