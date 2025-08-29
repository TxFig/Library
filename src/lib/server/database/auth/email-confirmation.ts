import type { Prisma, User } from "@prisma/client"
import prisma from "$lib/server/database/prisma"
import { sendMail } from "$lib/server/mail"
import { env } from "$env/dynamic/private"
import { log, logError } from "$lib/server/database/logs"
import { v4 as uuidv4 } from "uuid"
import round from "$lib/utils/round"
import urlsServer from "$lib/urls-server"


function newEmailExpirationDate() {
    const date = new Date()
    date.setSeconds(date.getSeconds() + +env.EMAIL_CONFIRMATION_EXPIRATION_TIME)
    return date
}
const emailExpirationTimeInMinutes = round(+env.EMAIL_CONFIRMATION_EXPIRATION_TIME / 60, 2).toString()

export async function sendEmailAndCreateRequest(
    user: User,
    redirectPath: string = "/"
): Promise<void> {
    const token = uuidv4()

    await create(token, user.id)
    const magic_link = urlsServer.magicLink(token, redirectPath)
    await sendMail(user.email, "emailConfirmation", {
        expiration_time: emailExpirationTimeInMinutes,
        magic_link,
        verification_code: ""
    })
}

export async function create(token: string, userId: number) {
    await prisma.emailConfirmationRequest.create({
        data: {
            token,
            userId,
            expireDate: newEmailExpirationDate()
        }
    })
}

export function getUnique<T extends Prisma.EmailConfirmationRequestFindUniqueArgs>(
    args: Parameters<typeof prisma.emailConfirmationRequest.findUnique<T>>[0]
) {
    return prisma.emailConfirmationRequest.findUnique(args)
}

export async function deleteByToken(token: string): Promise<void> {
    await prisma.emailConfirmationRequest.delete({
        where: { token }
    })
}


export default {
    sendEmailAndCreateRequest,
    create,
    getUnique,
    deleteByToken
}
