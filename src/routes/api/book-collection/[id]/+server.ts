import HttpCodes from "$lib/utils/http-codes"
import { error, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import db from "$lib/server/database/"


export const DELETE: RequestHandler = async ({ locals, params }) => {
    if (!locals.user) {
        error(HttpCodes.ClientError.Unauthorized, {
            message: "Need to be logged in"
        })
    }

    const collectionId = params.id
    const collectionIdNumber = Number(collectionId)
    if (!collectionId || !Number.isInteger(collectionIdNumber)) {
        return error(HttpCodes.ClientError.BadRequest, {
            message: "Collection id is required",
        })
    }

    try {
        await db.books.collection.deleteCollection(collectionIdNumber, locals.user.id)
        return json({
            message: "Collection deleted"
        }, {
            status: HttpCodes.Success
        })
    } catch (err) {
        return error(HttpCodes.ServerError.InternalServerError, {
            message: "Failed to delete collection",
        })
    }
}
