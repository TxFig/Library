import type { EmailConfirmationRequest, User } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { prisma } from ".."
import { sendConfirmationEmail } from "$lib/utils/mail"
import generateExpirationDate from "$lib/utils/generate-expiration-date"
import { env } from "$env/dynamic/private"
import log, { logError } from "$lib/logging"


export async function sendConfirmationEmailAndSaveRequest(
    user: User,
    redirectPath: string = "/"
): Promise<void> {
    const token = uuidv4()

    try {
        await sendConfirmationEmail(user.email, token, redirectPath)
        await log("info", `Email confirmation request sent to: ${user.email}`, user.id)
        await prisma.emailConfirmationRequest.create({
            data: {
                token,
                expireDate: generateExpirationDate(+env.EMAIL_CONFIRMATION_EXPIRATION_TIME),
                userId: user.id
            }
        })
    } catch (err) {
        await logError(err, `Error sending email confirmation request to: ${user.email}`, user.id)
        throw err
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
