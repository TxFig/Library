import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({ request }) => {
        console.log(Array.from((await request.formData()).entries()))
    }
}
