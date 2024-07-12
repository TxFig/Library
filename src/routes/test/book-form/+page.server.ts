import { fail, message, superValidate } from "sveltekit-superforms"
import type { Actions, PageServerLoad } from "./$types"
import { zod } from "sveltekit-superforms/adapters"
import { BookCreateSchema } from "$lib/validation/book/book-form"


export const load: PageServerLoad = async () => {
    const form = await superValidate(zod(BookCreateSchema))

    return { form }
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
