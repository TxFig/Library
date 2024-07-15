import type { Actions, PageServerLoad } from "./$types"
import { error, fail } from "@sveltejs/kit"

import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import API from "$lib/server/api"
import { HttpError } from "$lib/utils/custom-errors"
import { message, superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"
import { BookCreateSchema } from "$lib/validation/book/book-form"
import { applyDecorators } from "$lib/decorators"
import AuthDecorator from "$lib/decorators/auth"
import type { BookPostMethodReturn } from "$lib/server/api/book/POST"


export const load: PageServerLoad = async ({ url }) => {
    const isbn = url.searchParams.get("isbn") ?? ""

    return {
        form: await superValidate({ isbn }, zod(BookCreateSchema), { errors: false }),

        allAuthors: await db.books.author.getAllAuthors(),
        allPublishers: await db.books.publisher.getAllPublishers(),
        allSubjects: await db.books.subject.getAllSubjects(),
        allLocations: await db.books.location.getAllLocations(),
        allLanguages: await db.books.language.getAllLanguages()
    }
}

export const actions: Actions = {
    default: applyDecorators(
        [AuthDecorator(["Create Book"])],
        async ({ request, locals }) => {
            const formData = await request.formData()
            const form = await superValidate(formData, zod(BookCreateSchema))

            if (!form.valid) {
                return fail(400, { form })
            }

            let info: BookPostMethodReturn
            try {
                info = await API.book.POST(form, locals.user!.id)

                if (!info.success)
                    return fail(info.code, form)

                return message(form, {
                    type: info.success ? "success" : "error",
                    text: info.message
                })
            }
            catch (err) {
                if (err instanceof HttpError) error(err.httpCode, err.message)
                else error(HttpCodes.ServerError.InternalServerError, "Internal Server Error")
            }
        }
    )
}
