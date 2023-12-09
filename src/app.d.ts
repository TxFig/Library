// See https://kit.svelte.dev/docs/types#app

import type { User } from "@prisma/client"

// for information about these interfaces
declare global {
    namespace App {
        interface Error {
            message: string
        }
        // interface Locals {}
        interface PageData {
            user: User | null
        }
        // interface Platform {}
    }
}

export { }
