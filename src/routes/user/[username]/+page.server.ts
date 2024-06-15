import db from "$lib/server/database/"
import { error, fail } from "@sveltejs/kit"
import HttpCodes from "$lib/utils/http-codes.js"
import type { BookCollectionWithBooks } from "$lib/server/database/books/collection.js"


export const load = async ({ params, locals }) => {
    const user = await db.auth.user.getUserByUsername(params.username)

    if (!user) {
        error(HttpCodes.ClientError.NotFound, { message: "User not found" })
    }


    const isCurrentUser = user.id === locals.user?.id

    return {
        pageUser: user,
        isCurrentUser
    }
}


export const actions = {
    "create-book-collection": async ({ request, locals, params }) => {
        const user = await db.auth.user.getUserByUsername(params.username)
        const isCurrentUser = user?.id === locals.user?.id
        if (!user || !isCurrentUser) {
            error(HttpCodes.ClientError.NotFound, { message: "User not found" })
        }

        const formData = await request.formData()
        const name = formData.get("name")
        if (!name || typeof name !== "string") {
            return fail(HttpCodes.ClientError.BadRequest, {
                message: "Name is required",
            })
        }


        const isNameAvailable = await db.books.collection.isNameAvailable(name, user.id)
        if (!isNameAvailable) {
            return fail(HttpCodes.ClientError.BadRequest, {
                message: "Collection name already exists",
            })
        }

        const createBookCollection = await db.books.collection.createCollection(name, user.id)
        return {
            createBookCollection
        }
    }
}
