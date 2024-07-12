import type { Actions, PageServerLoad } from "./$types";
import { z } from "zod";
import { message, superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"
import { fail } from "@sveltejs/kit";


const schema = z.object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    number: z.number().optional(),
    array: z.string().array().default([])
})

export const load: PageServerLoad = async () => {
    const form = await superValidate(zod(schema))

    return { form }
}

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData()
        console.log(formData)
        const form = await superValidate(formData, zod(schema));
        console.dir(form, { depth: 8 });

        if (!form.valid) {
            return fail(400, { form });
        }

        return message(form, {
            text: 'Form posted successfully!',
            type: 'success'
        });
    }
};
