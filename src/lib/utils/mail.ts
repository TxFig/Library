import nodemailer, { type SentMessageInfo } from "nodemailer"
import { env } from "$env/dynamic/private";
import EmailConfirmationHtml from "$lib/components/emails/EmailConfirmation.html?raw"


const transport = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: Number(env.EMAIL_PORT),
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD
    },
    from: env.EMAIL_FROM
})


export async function sendConfirmationEmail(to: string, token: string, redirectPath: string): Promise<SentMessageInfo> {
    const url = `${env.ORIGIN}/auth/email-confirmation/${token}?redirect=${redirectPath}`
    const html = EmailConfirmationHtml.replace("{url}", url)

    return await transport.sendMail({
        to, html,
        subject: "Library Email Confirmation"
    })
}
