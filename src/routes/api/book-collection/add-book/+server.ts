import HttpCodes from "$lib/utils/http-codes"
import { error, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import db from "$lib/server/database/"


export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        error(HttpCodes.ClientError.Unauthorized, {
            message: "Need to be logged in"
        })
    }

    const body = await request.json()
    const { collectionName, isbn } = body
    if (!collectionName || !isbn) {
        return error(HttpCodes.ClientError.BadRequest, {
            message: "Collection name and isbn are required",
        })
    }

    try {
        await db.books.collection.addBookToCollection(collectionName, isbn)
        return json({}, {
            status: HttpCodes.Success
        })
    } catch (err) {
        return json({
            message: "Failed to add book to collection"
        }, {
            status: HttpCodes.ServerError.InternalServerError
        })
    }
}
