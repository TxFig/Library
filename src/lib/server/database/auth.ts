import { v4 as uuidv4 } from "uuid"
import prisma from "."
import nodemailer from "nodemailer"
import {
    EMAIL_CONFIRMATION_EXPIRATION_TIME,
    EMAIL_FROM,
    EMAIL_HOST,
    EMAIL_PASSWORD,
    EMAIL_PORT,
    EMAIL_USER,
    ORIGIN
} from "$env/static/private"
import type { User, EmailConfirmationRequest } from "@prisma/client"


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

function generateExpirationDate(): Date {
    const now = new Date()
    now.setSeconds(now.getSeconds() + +EMAIL_CONFIRMATION_EXPIRATION_TIME)
    return now
}

export async function sendConfirmationEmail(user: User): Promise<Error | undefined> {
    try {
        const token = uuidv4()
        const confirmationURL = `${ORIGIN}/auth/email-confirmation/${token}`

        // await transport.sendMail({
        //     to: user.email,
        //     subject: "Library Email Confirmation",
        //     text: confirmationEmailText(confirmationURL)
        // })

        console.log(confirmationURL)

        await prisma.emailConfirmationRequest.create({
            data: {
                token,
                expireDate: generateExpirationDate(),
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

export async function createSession(userId: number): Promise<string> {
    const token = uuidv4()

    await prisma.session.create({
        data: {
            token, userId,
            expireDate: generateExpirationDate()
        }
    })

    return token
}

//* Delete all user sessions from one session token
export async function deleteSession(sessionToken: string): Promise<void> {
    const user = await prisma.user.findFirst({
        where: {
            session: {
                some: {
                    token: sessionToken
                }
            }
        }
    })
    if (!user) return

    await prisma.session.deleteMany({
        where: {
            user: {
                id: user.id
            }
        }
    })
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

export async function getAllUsers(): Promise<User[]> {
    return await prisma.user.findMany()
}

export async function createUser(user: Omit<User, "id">): Promise<User> {
    return await prisma.user.create({
        data: user
    })
}
