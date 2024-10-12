import type { Actions, PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import api from "$lib/server/api"
import { fail, message, superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"
import { BookCreateSchema } from "$lib/validation/book/book"
import { applyDecorators } from "$lib/decorators"
import AuthDecorator from "$lib/decorators/auth"
import type { BookPostMethodReturn } from "$lib/server/api/book/POST"


export const load: PageServerLoad = async ({ url }) => ({
    form: await superValidate({
        edition: {
            isbn: url.searchParams.get("isbn") ?? undefined,
            title: "",
            language: ""
        },
    }, zod(BookCreateSchema), { errors: false }),

    allAuthors: await db.books.author.getAllAuthors(),
    allPublishers: await db.books.publisher.getAllPublishers(),
    allSubjects: await db.books.subject.getAllSubjects(),
    allLocations: await db.books.location.getAllLocations(),
    allLanguages: await db.books.language.getAllLanguages()
})

export const actions: Actions = {
    default: applyDecorators(
        [AuthDecorator(["Create Book"])],
        async ({ request, locals }) => {
            const formData = await request.formData()
            const form = await superValidate(formData, zod(BookCreateSchema))
            console.log(form.data, form.errors)
            if (!form.valid) {
                return fail(HttpCodes.ClientError.BadRequest, { form })
            }

            let info: BookPostMethodReturn
            try {
                info = await api.book.POST(form, locals.user!.id)

                return message(form, {
                    type: info.success ? "success" : "error",
                    text: info.message
                }, !info.success ? {
                    status: info.code
                } : undefined)
            }
            catch (err) {
                error(HttpCodes.ServerError.InternalServerError, "Internal Server Error")
            }
        }
    )
}
