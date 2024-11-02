import db from "$lib/server/database/"

import { HttpCodes } from "$lib/utils/http-codes"
import type { Book } from "@prisma/client"

import type { ApiMethodReturn } from "$lib/server/api"
import type { RequestEvent } from "."
import type { BaseEndpointFunction } from "$lib/server/api/endpoint"


type ReturnData = Book
export type BookGetMethodReturn = ApiMethodReturn<ReturnData>
export const GET: BaseEndpointFunction<RequestEvent, ReturnData> = async function(event) {
    const { params: { bookPublicId } } = event

    try {
        const book = await db.books.book.getUniqueBook({
            where: { publicId: bookPublicId }
        })
        if (book) {
            return {
                data: book,
                success: true
            }
        }
        return {
            success: false,
            code: HttpCodes.ClientError.NotFound,
            message: "Book Not Found"
        }
    } catch (err) {
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error retrieving books"
        }
    }
}


export default GET
