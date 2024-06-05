// See https://kit.svelte.dev/docs/types#app

import type { Session } from "@prisma/client"
import type { EntireUser } from "$lib/server/database/auth"


// for information about these interfaces
declare global {
    namespace App {
        interface Error {
            message: string
            error?: any
        }

        interface FormError {
            message: string
            error?: any

            [key: string]: any
        }

        interface Locals {
            user: EntireUser | null
            session: Session | null
        }

        interface PageData {
            user: EntireUser | null
        }
        // interface Platform {}
    }
}

export { }
