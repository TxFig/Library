import type { Actions, PageServerLoad } from "./$types"
import { redirect } from "@sveltejs/kit"

import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import api from "$lib/server/api"
import { fail, message, superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import { FormBookSchema } from "$lib/validation/book"
import authValidator from "$lib/request-validators/auth"
import { error } from "@sveltejs/kit"


export const load: PageServerLoad = async ({ url }) => ({
    form: await superValidate(valibot(FormBookSchema)),
    allAuthors: await db.books.author.getAllTransformed(),
    allSubjects: await db.books.subject.getAllTransformed(),
    allLanguages: await db.books.language.getAllTransformed(),
    allPublishers: await db.books.publisher.getAllTransformed(),
    users: await db.auth.user.getAllTransformed()
})

export const actions: Actions = {
    default: async (event) => {
        authValidator(event, (status, message) => {
            error(status, { message })
        }, ["Create Book"])
        const { request, locals } = event

        const formData = await request.formData()
        const form = await superValidate(formData, valibot(FormBookSchema))

        if (!form.valid) {
            return fail(HttpCodes.ClientError.BadRequest, { form })
        }

        const result = await api.books.POST(form.data, locals)
        if (result.success) {
            redirect(HttpCodes.SeeOther, `/book/${result.data.id}`)
        }

        return message(form, {
            type: result.success ? "success" : "error",
            text: result.message
        }, !result.success ? {
            status: result.code
        } : undefined)
    }
}
