import type { PageData } from "$lib/types"


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
            user: PageData.User.Raw | null
            session: PageData.Session.Raw | null
        }

        interface PageData {
            user: PageData.User | null
            session: PageData.Session | null
            publicAccess: boolean
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

export {}
