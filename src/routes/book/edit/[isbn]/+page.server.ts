import type { Actions, PageServerLoad } from "./$types"
import { error, fail, redirect } from "@sveltejs/kit"

import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { parseISBN } from "$lib/validation/isbn"
import { HttpError } from "$lib/utils/custom-errors"
import API from "@api"
import type { PatchMethodReturn } from "@api/book"
import { hasPermission } from "$lib/utils/permissions"


export const load: PageServerLoad = async ({ params }) => {
    const { isbn: isbnString } = params

    let isbn: string
    try {
        isbn = parseISBN(isbnString)
    } catch (err) {
        if (err instanceof HttpError) error(err.httpCode, err.message)
        else error(HttpCodes.ServerError.InternalServerError, "Internal Server Error")
    }

    const book = await db.book.getEntireBookByISBN(isbn)
    if (!book) {
        error(HttpCodes.ClientError.NotFound, "Book Not Available")
    }

    return {
        book,
        allAuthors: await db.book.getAllAuthors(),
        allPublishers: await db.book.getAllPublishers(),
        allSubjects: await db.book.getAllSubjects(),
        allLocations: await db.book.getAllLocations(),
        allLanguages: await db.book.getAllLanguages()
    }
}

export const actions: Actions = {
    default: async ({ request, locals }) => {
        if (!locals.user || !hasPermission(locals.user, "Edit Book")) {
            error(HttpCodes.ClientError.Unauthorized, {
                message: "Need to be logged in"
            })
        }

        const formData = await request.formData()

        let info: PatchMethodReturn
        try {
            info = await API.book.PATCH(locals.user, formData)

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
