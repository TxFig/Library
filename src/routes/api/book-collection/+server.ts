import type { RequestHandler } from "./$types";
import db from "$lib/server/database/"
import { error, json } from "@sveltejs/kit";
import { HttpCodes } from "$lib/utils/http-codes"
import type { BookCollectionWithBooks } from "$lib/server/database/books/collection";


export type BookCollectionPostResponse = {
    status: HttpCodes["ClientError"]["BadRequest"] | HttpCodes["ClientError"]["Conflict"]
    message: string
} | {
    status: HttpCodes["Success"]
    createdBookCollection: BookCollectionWithBooks
}
export const POST: RequestHandler = async ({ locals, request }) => {
    if (!locals.user) {
        error(HttpCodes.ClientError.Unauthorized, {
            message: "Need to be logged in"
        })
    }

        const data = await request.json()
        const name = data.name
        if (!name || typeof name !== "string") {
            return json({
                message: "Name is required",
                status: HttpCodes.ClientError.BadRequest
            }, {
                status: HttpCodes.ClientError.BadRequest
            })
        }


        const isNameAvailable = await db.books.collection.isNameAvailable(name, locals.user.id)
        if (!isNameAvailable) {
            return json({
                message: "Collection name already exists",
                status: HttpCodes.ClientError.Conflict
            }, {
                status: HttpCodes.ClientError.Conflict
            })
        }

        const createdBookCollection = await db.books.collection.createCollection(name, locals.user.id)
        return json({
            createdBookCollection,
            status: HttpCodes.Success
        }, {
            status: HttpCodes.Success
        })
}
