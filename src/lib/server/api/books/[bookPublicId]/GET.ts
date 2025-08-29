// import db from "$lib/server/database/"
// import { HttpCodes } from "$lib/utils/http-codes"
// import type { ApiMethodReturn } from "$lib/server/api"
// import type { SanitizedBook } from "$lib/server/database/books/book"
// import type { SanitizedAuthor } from "$lib/server/database/books/author"
// import type { SanitizedBookEdition } from "$lib/server/database/books/edition"
// import type { SanitizedSubject } from "$lib/server/database/books/subject"


// export type BookGetMethodReturn = ApiMethodReturn<SanitizedBook & {
//     authors: SanitizedAuthor["name"][],
//     editions: SanitizedBookEdition["id"][],
//     subjects: SanitizedSubject["value"][]
// }, undefined>
// type Params = { publicId: string }
// export const GET = async function(params: Params): Promise<BookGetMethodReturn> {
//     const { publicId } = params

//     try {
//         const data = await db.books.book.getUnique({
//             where: { publicId },
//             include: {
//                 authors: true,
//                 editions: true,
//                 subjects: true
//             }
//         })

//         if (!data) {
//             return {
//                 success: false,
//                 code: HttpCodes.ClientError.NotFound,
//                 message: "Book Not Found"
//             }
//         }

//         const { authors, editions, subjects, ...book } = data
//         const sanitizedData = {
//             ...db.books.book.sanitize(book),
//             authors: authors.map(author => author.name),
//             editions: editions.map(edition => edition.publicId),
//             subjects: subjects.map(subjects => subjects.value)
//         }

//         return {
//             data: sanitizedData,
//             success: true
//         }
//     } catch (err) {
//         return {
//             success: false,
//             code: HttpCodes.ServerError.InternalServerError,
//             message: "Error retrieving book"
//         }
//     }
// }


// export default GET
