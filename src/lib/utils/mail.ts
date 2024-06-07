import nodemailer, { type SentMessageInfo } from "nodemailer"
import { EMAIL_FROM, EMAIL_HOST, EMAIL_PASSWORD, EMAIL_PORT, EMAIL_USER, ORIGIN } from "$env/static/private";
import EmailConfirmationHtml from "$lib/components/emails/EmailConfirmation.html?raw"


const transport = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
    },
    from: EMAIL_FROM
})


export async function sendConfirmationEmail(to: string, token: string, redirectPath: string): Promise<SentMessageInfo> {
    const url = `${ORIGIN}/auth/email-confirmation/${token}?redirect=${redirectPath}`
    const html = EmailConfirmationHtml.replace("{url}", url)

    return await transport.sendMail({
        to, html,
        subject: "Library Email Confirmation"
    })
}
