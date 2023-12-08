import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { validate } from "uuid"
import {
    createSession,
    deleteEmailConfirmationRequestByToken,
    getEmailConfirmationRequestByToken,
    validateExpireTime
} from "$lib/server/database/auth";

export const load: PageServerLoad = async ({ params, cookies }) => {
    const { token } = params

    if (!validate(token)) {
        throw redirect(303, "/auth/login/")
    }

    const emailConfirmationRequest = await getEmailConfirmationRequestByToken(token)
    if (!emailConfirmationRequest) {
        throw redirect(303, "/auth/login/")
    }
    else if (emailConfirmationRequest && !validateExpireTime(emailConfirmationRequest.expireDate)) {
        await deleteEmailConfirmationRequestByToken(token)
        throw redirect(303, "/auth/login/")
    }

    await deleteEmailConfirmationRequestByToken(token)

    const sessionToken = await createSession(emailConfirmationRequest.userId)
    cookies.set("sessionToken", sessionToken)

    return {
        username: emailConfirmationRequest.user.username
    }
}
