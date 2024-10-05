// See https://kit.svelte.dev/docs/types#app

import type { PageDataUser } from "$lib/server/database/auth/types"
import type { Session } from "@prisma/client"


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
            user: PageDataUser | null
            session: Session | null
        }

        interface PageData {
            user: PageDataUser | null
            session: Session | null
        }
        // interface Platform {}

        namespace Superforms {
            interface Message {
                text: string
                type: "success" | "error"
            }
        }
    }
}

export { }
