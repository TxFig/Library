// See https://kit.svelte.dev/docs/types#app

import type { Session, User } from "@prisma/client"

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
            user: User | null
            session: Session | null
        }

        interface PageData {
            user: User | null
        }
        // interface Platform {}
    }
}

export { }
