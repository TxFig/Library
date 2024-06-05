import { v4 as uuidv4 } from "uuid"
import { prisma } from "."
import nodemailer from "nodemailer"
import {
    EMAIL_CONFIRMATION_EXPIRATION_TIME,
    EMAIL_FROM,
    EMAIL_HOST,
    EMAIL_PASSWORD,
    EMAIL_PORT,
    EMAIL_USER,
    ORIGIN,
    SESSION_EXPIRATION_TIME
} from "$env/static/private"
import { type User, type EmailConfirmationRequest, ReadingState, type Session, type PermissionGroup, type UserBookReadingState } from "@prisma/client"


const transport = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
    },
    from: EMAIL_FROM
})

type UserAndEmailConfirmation = User & {
    emailConfirmationRequest: EmailConfirmationRequest | null
}
export async function getUserByEmail(email: string): Promise<UserAndEmailConfirmation | null> {
    return await prisma.user.findUnique({
        where: { email },
        include: {
            emailConfirmationRequest: true
        }
    })
}

function confirmationEmailText(confirmationURL: string): string {
    return `
        Use the following link to login into your library account:
        ${confirmationURL}
    `.trim()
}

function generateExpirationDate(time: number): Date {
    const now = new Date()
    now.setSeconds(now.getSeconds() + time)
    return now
}

export async function sendConfirmationEmail(
    user: User,
    redirectPath: string = "/"
): Promise<Error | undefined> {
    try {
        const token = uuidv4()
        const confirmationURL = `${ORIGIN}/auth/email-confirmation/${token}?redirect=${redirectPath}`

        await transport.sendMail({
            to: user.email,
            subject: "Library Email Confirmation",
            text: confirmationEmailText(confirmationURL)
        })

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

export function validateExpireTime(time: Date): boolean {
    return time.getTime() > Date.now()
}

export function isSessionValid(session: Session): boolean {
    return session.expireDate.getTime() > Date.now()
}

export async function createSession(userId: number): Promise<{ token: string, expireDate: Date }> {
    const token = uuidv4()
    const expireDate = generateExpirationDate(+SESSION_EXPIRATION_TIME)

    await prisma.session.create({
        data: {
            token, userId, expireDate
        }
    })

    return { token, expireDate }
}

export async function deleteSessionByToken(token: string): Promise<void> {
    await prisma.session.delete({
        where: { token }
    })
}


export type EntireUser = User & {
    permissionGroup: PermissionGroup
    userBookReadingState: UserBookReadingState[]
}
export async function getEntireUserAndSessionBySessionToken(sessionToken: string): Promise<
    { user: EntireUser, session: Session } |
    { user: null, session: null }
> {
    const result = await prisma.session.findUnique({
        where: {
            token: sessionToken
        },
        include: { user: {
            include: {
                permissionGroup: true,
                userBookReadingState: true
            }
        } }
    })

    if (result) {
        const { user, ...session } = result
        return { user, session }
    }

    return { user: null, session: null }
}

export async function getUserBySessionToken(sessionToken: string): Promise<User | null> {
    return prisma.user.findFirst({
        where: {
            session: {
                some: {
                    token: sessionToken
                }
            }
        }
    })
}

export async function getAllEntireUsers(): Promise<EntireUser[]> {
    return await prisma.user.findMany({
        include: {
            permissionGroup: true,
            userBookReadingState: true
        }
    })
}

export type InsertUserInput = Omit<User, "id" | "permissionGroupId"> & {
    permissionGroup: string
}
export async function createUser(userAndPermissionGroupName: InsertUserInput): Promise<EntireUser> {
    const { permissionGroup, ...user } = userAndPermissionGroupName
    return await prisma.user.create({
        data: {
            ...user,
            permissionGroup: {
                connect: {
                    name: permissionGroup
                }
            }
        },
        include: {
            permissionGroup: true,
            userBookReadingState: true
        }
    })
}

export async function updateUser(userId: number, userAndPermissionGroupName: InsertUserInput): Promise<EntireUser> {
    const { permissionGroup, ...user } = userAndPermissionGroupName
    return await prisma.user.update({
        where: { id: userId },
        data: {
            ...user,
            permissionGroup: {
                connect: {
                    name: permissionGroup
                }
            }
        },
        include: {
            permissionGroup: true,
            userBookReadingState: true
        }
    })
}

export async function deleteUser(id: number): Promise<EntireUser> {
    return await prisma.user.delete({
        where: { id },
        include: {
            permissionGroup: true,
            userBookReadingState: true
        }
    })
}

export type AllReadingState = "NOT READ" | ReadingState
export const AllReadingStates = ["NOT READ", "READING", "READ"] as const //! Hardcoded
export async function updateUserReadingState(bookId: bigint, userId: number, state: AllReadingState): Promise<void> {
    if (state == "NOT READ") {
        try {
            await prisma.userBookReadingState.delete({
                where: {
                    userId_bookId: { bookId, userId }
                }
            })
        } catch {}
    } else {
        await prisma.userBookReadingState.upsert({
            where: {
                userId_bookId: { bookId, userId }
            },
            create: {
                state,
                bookId,
                userId
            },
            update: {
                state
            }
        })
    }
}

export async function getBookReadingState(isbn: bigint, userId: number): Promise<ReadingState | null> {
    const userBookReadingState = await prisma.userBookReadingState.findUnique({
        where: {
            userId_bookId: {
                bookId: isbn,
                userId
            }
        }
    })
    return userBookReadingState?.state ?? null
}

export async function getUsersCount(): Promise<number> {
    return await prisma.user.count()
}

export async function getAllPermissionGroups(): Promise<PermissionGroup[]> {
    return await prisma.permissionGroup.findMany()
}

export default {
    getUserByEmail,
    sendConfirmationEmail,
    getEmailConfirmationRequestByToken,
    deleteEmailConfirmationRequestByToken,
    validateExpireTime,
    createSession,
    deleteSessionByToken,
    getUserBySessionToken,
    getAllEntireUsers,
    createUser,
    updateUser,
    deleteUser,
    updateUserReadingState,
    getBookReadingState,
    getEntireUserAndSessionBySessionToken,
    getUsersCount,
    getAllPermissionGroups
}
