import { env } from "$env/dynamic/private";
import { env as publicEnv } from "$env/dynamic/public";


export default {
    magicLink: (token: string, redirectPath: string) =>
        `${env.ORIGIN}/auth/email-confirmation/${token}?${publicEnv.PUBLIC_REDIRECT_QUERY_KEY}=${redirectPath}`,

    copiesDashboard: `${env.ORIGIN}/dashboard/copies`
}
