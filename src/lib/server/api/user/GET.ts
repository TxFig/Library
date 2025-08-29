// import { HttpCodes, type HttpErrorCodesValues } from "$lib/utils/http-codes"
// import type { Implements } from "$lib/utils/types"
// import type { ApiMethodReturn } from ".."

// import db from "$lib/server/database/"
// import type { SanitizedUser } from "$lib/server/database/auth/user"


// export type UserGetMethodReturn = Implements<ApiMethodReturn, {
//     data: SanitizedUser | SanitizedUser[],
//     success: true
// } | {
//     success: false
//     code: HttpErrorCodesValues
//     message: string
// }>

// export async function GET(publicId?: string): Promise<UserGetMethodReturn> {
//     try {
//         if (publicId) {
//             const user = await db.auth.user.getUnique({ where: { publicId } })
//             if (user) {
//                 return {
//                     data: db.auth.user.sanitize(user),
//                     success: true
//                 }
//             }
//             return {
//                 success: false,
//                 code: HttpCodes.ClientError.NotFound,
//                 message: "User Not Found"
//             }
//         }
//         const users = await db.auth.user.getAll()
//         return {
//             data: users.map(db.auth.user.sanitize),
//             success: true
//         }
//     }
//     catch {
//         return {
//             success: false,
//             code: HttpCodes.ServerError.InternalServerError,
//             message: "Error retrieving user(s)"
//         }
//     }
// }

// export default GET
