import { env } from "$env/dynamic/private"
import generateExpirationDate from "$lib/utils/generate-expiration-date"
import type { Session, User } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { prisma } from ".."
import { PageDataUserInclude, type PageDataUser } from "./types"


export async function createSession(userId: number): Promise<Session> {
    const token = uuidv4()
    const expireDate = generateExpirationDate(+env.SESSION_EXPIRATION_TIME)

    return await prisma.session.create({
        data: {
            token, userId, expireDate
        }
    })
}

export async function deleteSessionByToken(token: string): Promise<Session> {
    return await prisma.session.delete({
        where: { token }
    })
}

export async function getEntireUserAndSessionBySessionToken(sessionToken: string): Promise<
    { user: PageDataUser, session: Session } |
    { user: null, session: null }
> {
    const result = await prisma.session.findUnique({
        where: {
            token: sessionToken
        },
        include: {
            user: {
                include: PageDataUserInclude
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
