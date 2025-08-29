import type { LayoutServerLoad } from "./$types"
import db from "$lib/server/database/"
import applyTransformSpec from "$lib/utils/transform-object"
import { PageData } from "$lib/types"


export const load: LayoutServerLoad = async ({ locals }) => {
    const appSettings = await db.config.getSettings()
    return {
        ...locals,
        user: locals.user && applyTransformSpec(locals.user, PageData.User.spec),
        session: locals.session && applyTransformSpec(locals.session, PageData.Session.spec),
        publicAccess: appSettings.public
    }
}
