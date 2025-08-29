import nodemailer from "nodemailer"
import { env } from "$env/dynamic/private";
import { log } from "./database/logs";
import messages from "$lib/messages";

import AccountCreatedHtml from "$lib/emails/AccountCreated.html?raw"
import EmailConfirmationHtml from "$lib/emails/EmailConfirmation.html?raw"
import CopyRequestedHtml from "$lib/emails/CopyRequested.html?raw"
import CopyRequestCanceled from "$lib/emails/CopyRequestCanceled.html?raw"
import CopyRequestAccepted from "$lib/emails/CopyRequestAccepted.html?raw"
import CopyRequestRejected from "$lib/emails/CopyRequestRejected.html?raw"
import { dev } from "$app/environment";


const transport = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: Number(env.EMAIL_PORT),
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD
    },
    from: env.EMAIL_FROM
})

export const commonData = {
    github_image: env.EMAIL_GITHUB_IMAGE,
    github_link: env.EMAIL_GITHUB_LINK,
    logo_image: env.EMAIL_LOGO_IMAGE
}

function fillHtml(html: string, data: Record<string, string>) {
    for (const [key, value] of Object.entries(data)) {
        html = html.replaceAll(`{${key}}`, value)
    }
    return html
}

type Emails = {
    "accountCreated": {
        redirect: string
    },
    "emailConfirmation": {
        magic_link: string
        verification_code: string
        expiration_time: string
    },
    "copyRequested": {
        username: string
        title: string
        authors: string
        location: string
        request_date: string
        duration: string
        start_date: string
        dashboard_link: string
    },
    "copyRequestCancelled": {
        username: string
        title: string
        authors: string
        location: string
        request_date: string
        cancel_date: string
    },
    "copyRequestAccepted": {
        title: string
        authors: string
        location: string
        start_date: string
        duration: string
        due_date: string
        library_link: string
    },
    "copyRequestRejected": {
        title: string
        authors: string
        location: string
        library_link: string
    }
}
type EmailConfig = { html: string, subject: string }
const emails: { [K in keyof Emails]: EmailConfig } = {
    "accountCreated": {
        html: AccountCreatedHtml,
        subject: "Account Created"
    },
    "emailConfirmation": {
        html: EmailConfirmationHtml,
        subject: "Email Confirmation"
    },
    "copyRequested": {
        html: CopyRequestedHtml,
        subject: "Copy Requested"
    },
    "copyRequestCancelled": {
        html: CopyRequestCanceled,
        subject: "Copy Request Cancelled"
    },
    "copyRequestAccepted": {
        html: CopyRequestAccepted,
        subject: "Copy Request Accepted"
    },
    "copyRequestRejected": {
        html: CopyRequestRejected,
        subject: "Copy Request Rejected"
    }
}

export async function sendMail<EmailName extends keyof Emails>(to: string, name: EmailName, data: Emails[EmailName]) {
    const html = fillHtml(emails[name].html, {
        ...commonData,
        ...data,
        email: to
    })
    const subject = emails[name].subject

    if (dev && true) {
        await log("debug", "sendMail", {
            to, data, subject
        })
        return
    }

    await transport.sendMail({
        to, html,
        subject: `Library - ${subject}`
    })
    await log("info", messages.email.sent, {
        to, subject
    })
}
