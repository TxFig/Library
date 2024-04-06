import type { Actions, PageServerLoad } from "./$types"
import { error, fail, redirect } from "@sveltejs/kit"

import db from "$lib/server/database/book"
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
        console.log("C")
        if (!locals.user) {
            error(HttpCodes.ClientError.Unauthorized, {
                message: "Need to be logged in"
            })
        }

        const formData = await request.formData()

        try {
            const info = await API.book.POST(formData)
            console.log(info)

            if (info.success) {
                redirect(HttpCodes.SeeOther, `/book/${info.book.isbn}`)
            }

            return fail(info.code, info)
        }
        catch (err) {
            if (err instanceof HttpError) {
                error(err.httpCode, err.message)
            }
        }
    }
}
