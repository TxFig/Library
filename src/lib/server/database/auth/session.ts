import { env } from "$env/dynamic/private"
import type { Session } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import prisma from "$lib/server/database/prisma"
import { PageData } from "$lib/types"


function newSessionExpirationDate() {
    const date = new Date()
    date.setSeconds(date.getSeconds() + +env.SESSION_EXPIRATION_TIME)
    return date
}

export async function createSession(userId: number): Promise<Session> {
    return await prisma.session.create({
        data: {
            userId,
            token: uuidv4(),
            expireDate: newSessionExpirationDate()
        }
    })
}

export async function deleteSessionByToken(token: string): Promise<Session> {
    return await prisma.session.delete({
        where: { token }
    })
}

export async function getEntireUserAndSessionBySessionToken(sessionToken: string): Promise<
    { user: PageData.User.Raw, session: PageData.Session.Raw } |
    { user: null, session: null }
> {
    const result = await prisma.session.findUnique({
        where: {
            token: sessionToken
        },
        include: {
            user: {
                include: PageData.User.include
            }
        }
    })

    if (result) {
        const { user, ...session } = result
        return { user, session }
    }

    return { user: null, session: null }
}


export default {
    createSession,
    deleteSessionByToken,
    getEntireUserAndSessionBySessionToken
}
