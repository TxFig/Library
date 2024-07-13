import { fail, message, superValidate } from "sveltekit-superforms"
import type { Actions, PageServerLoad } from "./$types"
import { zod } from "sveltekit-superforms/adapters"
import { BookCreateSchema } from "$lib/validation/book/book-form"
import db from "$lib/server/database"


export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(BookCreateSchema)),
        allAuthors: await db.books.author.getAllAuthors(),
        allPublishers: await db.books.publisher.getAllPublishers(),
        allSubjects: await db.books.subject.getAllSubjects(),
        allLocations: await db.books.location.getAllLocations(),
        allLanguages: await db.books.language.getAllLanguages(),
    }
}

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData()
        console.log(formData)

        const form = await superValidate(formData, zod(BookCreateSchema))

        if (!form.valid) {
            return fail(400, { form })
        }


        return message(form, {
            "type": "success",
            "text": "Book Created Successfully"
        })
    }
}
