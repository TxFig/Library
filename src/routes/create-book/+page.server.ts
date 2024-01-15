import type { Actions, PageServerLoad } from "./$types"
import { error, fail, redirect } from "@sveltejs/kit"

import db, { type InsertBookData } from "$lib/server/database/book"
import HttpCodes from "$lib/utils/http-codes"
import API from "@api"
import { HttpError } from "$lib/utils/custom-errors"


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
            error(HttpCodes.ClientError.Unauthorized, {
                message: "Need to be logged in"
            })
        }

        const formData = await request.formData()

        let book: InsertBookData
        try {
            book = await API.book.POST(formData)
        }
        catch (err) {
            if (err instanceof HttpError) {
                return fail(err.httpCode, {
                    message: err.message
                })
            } else return
        }

        redirect(HttpCodes.SeeOther, `/book/${book.isbn}`)
    }
}
