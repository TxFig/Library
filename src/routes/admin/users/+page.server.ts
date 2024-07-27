import type { PageServerLoad, Actions } from "./$types";
import db from "$lib/server/database/";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { UserCreateSchema } from "$lib/validation/auth/user";
import HttpCodes from "$lib/utils/http-codes";
import type { UserPostMethodReturn } from "$lib/server/api/user/POST";
import { error } from "@sveltejs/kit";
import api from "$lib/server/api";
import type { UserPatchMethodReturn } from "$lib/server/api/user/PATCH";
import { uuidv4Schema } from "$lib/validation/auth/uuid";


export const load: PageServerLoad = async ({ locals }) => ({
    createForm: await superValidate(zod(UserCreateSchema), { id: "create" }),
    updateForm: await superValidate(zod(UserCreateSchema), { id: "edit" }),
    users: locals.user ? await db.auth.user.getAllUsers() : [],
    allPermissionGroups: await db.auth.permissionGroup.getAllPermissionGroupsWithPermissions(),
})


export const actions: Actions = {
    create: async ({ request, locals }) => {
        const formData = await request.formData()
        const form = await superValidate(formData, zod(UserCreateSchema))

        if (!form.valid)
            return fail(HttpCodes.ClientError.BadRequest, { form })

        let info: UserPostMethodReturn
        try {
            info = await api.user.POST(form, locals.user!.id)

            if (!info.success)
                return message(form, {
                    type: "error",
                    text: info.message
                }, {
                    status: info.code
                })

            form.message = {
                type: "success",
                text: info.message
            }
            return { form, data: info.data }
        }
        catch (err) {
            error(HttpCodes.ServerError.InternalServerError, "Internal Server Error")
        }
    },
    update: async ({ request, locals }) => {
        const formData = await request.formData()
        const opaqueId = formData.get("opaqueId")
        const opaqueIdParsingResult = uuidv4Schema.safeParse(opaqueId)
        const form = await superValidate(formData, zod(UserCreateSchema))

        if (!form.valid || !opaqueIdParsingResult.success)
            return fail(HttpCodes.ClientError.BadRequest, { form })

        let info: UserPatchMethodReturn
        try {
            info = await api.user.PATCH(form, opaqueIdParsingResult.data, locals.user!.id)

            if (!info.success)
                return message(form, {
                    type: "error",
                    text: info.message
                }, {
                    status: info.code
                })

            form.message = {
                type: "success",
                text: info.message
            }
            return { form, data: info.data }
        }
        catch {
            error(HttpCodes.ServerError.InternalServerError, "Internal Server Error")
        }
    }
}
