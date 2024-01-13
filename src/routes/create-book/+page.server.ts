import type { Actions, PageServerLoad } from "./$types"
import { ActionFailure, error, redirect } from "@sveltejs/kit"

import db from "$lib/server/database/book"
import HttpCodes from "$lib/utils/http-codes"
import API from "@api"


export const load: PageServerLoad = async () => ({
    authors: await db.getAllAuthors(),
    publishers: await db.getAllPublishers(),
    subjects: await db.getAllSubjects(),
    locations: await db.getAllLocations(),
    languages: await db.getAllLanguages()
})

export const actions: Actions = {
    default: async ({ request, locals }) => {
        if (!locals.user) {
            throw error(HttpCodes.Unauthorized, {
                message: "Need to be logged in"
            })
        }

        const formData = await request.formData()

        const result = await API.book.POST(formData)

        if (result instanceof ActionFailure) {
            return result
        }
        const book = result

        throw redirect(HttpCodes.SeeOther, `/book/${book.isbn}`)
    }
}
