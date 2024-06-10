import type { Actions, PageServerLoad } from "./$types"
import { error, fail, redirect } from "@sveltejs/kit"

import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import API from "@api"
import { HttpError } from "$lib/utils/custom-errors"
import type { PostMethodReturn } from "@api/book"
import { hasPermission } from "$lib/utils/permissions"


export const load: PageServerLoad = async () => ({
    authors: await db.books.author.getAllAuthors(),
    publishers: await db.books.publisher.getAllPublishers(),
    subjects: await db.books.subject.getAllSubjects(),
    locations: await db.books.location.getAllLocations(),
    languages: await db.books.language.getAllLanguages()
})

export const actions: Actions = {
    default: async ({ request, locals }) => {
        if (!locals.user || !hasPermission(locals.user, "Create Book")) {
            error(HttpCodes.ClientError.Unauthorized, {
                message: "Need to be logged in"
            })
        }

        const formData = await request.formData()

        let info: PostMethodReturn
        try {
            info = await API.book.POST(locals.user, formData)

            if (!info.success)
                return fail(info.code, info)
        }
        catch (err) {
            if (err instanceof HttpError) error(err.httpCode, err.message)
            else error(HttpCodes.ServerError.InternalServerError, "Internal Server Error")
        }

        if (info.success) {
            redirect(HttpCodes.SeeOther, `/book/${info.book.isbn}`)
        }
    }
}
