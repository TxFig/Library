// import db from "$lib/server/database/"
// import { log, logError } from "$lib/server/database/logs"
// import HttpCodes from "$lib/utils/http-codes"

// import type { Book } from "@prisma/client"
// import type { ApiMethodReturn } from "$lib/server/api"
// import type { BookPatchSchema } from "$lib/validation/book"
// import type { SchemaToSuperValidated } from "$lib/validation/utils"
// import type { AuthEventLocals } from "$lib/request-validators/auth"


// export type BookPatchMethodReturn = ApiMethodReturn<Book, undefined>
// type Params = { publicId: string }
// export async function PATCH(
//     form: SchemaToSuperValidated<BookPatchSchema>,
//     params: Params,
//     locals: AuthEventLocals
// ): Promise<BookPatchMethodReturn> {
//     const { publicId } = params
//     const { data } = form

//     const doesBookExist = await db.books.book.getCount({ publicId }) !== 0
//     if (!doesBookExist) {
//         return {
//             success: false,
//             code: HttpCodes.ClientError.NotFound,
//             message: "Book Not Found"
//         }
//     }

//     try {
//         const book = await db.books.book.update(data)
//         await log("info", `Book updated: ${publicId}`, locals.user.id, data)

//         return {
//             success: true,
//             message: "Book Updated Successfully",
//             data: book
//         }
//     } catch (err) {
//         await logError(err, `Error updating book: ${publicId} in database`, locals.user.id)
//         return {
//             success: false,
//             code: HttpCodes.ServerError.InternalServerError,
//             message: "Error updating book in database"
//         }
//     }
// }

// export default PATCH
