import type { EmailConfirmationRequest, User } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { prisma } from ".."
import { sendConfirmationEmail } from "$lib/utils/mail"
import generateExpirationDate from "$lib/utils/generate-expiration-date"
import { EMAIL_CONFIRMATION_EXPIRATION_TIME } from "$env/static/private"


export async function sendConfirmationEmailAndSaveRequest(
    user: User,
    redirectPath: string = "/"
): Promise<Error | undefined> {
    try {
        const token = uuidv4()

        await sendConfirmationEmail(user.email, token, redirectPath)

        await prisma.emailConfirmationRequest.create({
            data: {
                token,
                expireDate: generateExpirationDate(+EMAIL_CONFIRMATION_EXPIRATION_TIME),
                userId: user.id
            }
        })
    } catch (error) {
        return error as Error
    }
}

type EmailConfirmationAndUser = EmailConfirmationRequest & {
    user: User
}
export async function getEmailConfirmationRequestByToken(token: string): Promise<EmailConfirmationAndUser | null> {
    return await prisma.emailConfirmationRequest.findUnique({
        where: { token },
        include: {
            user: true
        }
    })
}

export async function deleteEmailConfirmationRequestByToken(token: string): Promise<void> {
    await prisma.emailConfirmationRequest.delete({
        where: { token }
    })
}


export default {
    sendConfirmationEmailAndSaveRequest,
    getEmailConfirmationRequestByToken,
    deleteEmailConfirmationRequestByToken
}
