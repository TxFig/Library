import db from "$lib/server/database/"

import { HttpCodes } from "$lib/utils/http-codes"
import type { Book } from "@prisma/client"

import type { ApiMethodReturn } from ".."
import type { RequestEvent } from "."
import type { BaseEndpointFunction } from "../endpoint"


type ReturnData = Book[]
export type BookGetMethodReturn = ApiMethodReturn<ReturnData>
export const GET: BaseEndpointFunction<RequestEvent, ReturnData> = async function(_) {
    try {
        const books = await db.books.book.getBooks()
        return {
            data: books,
            success: true
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
