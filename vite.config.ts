import { sveltekit } from "@sveltejs/kit/vite"
import type { UserConfig } from "vite"
import { resolve } from "path"


const config: UserConfig = {
    plugins: [sveltekit()],
    resolve: {
        alias: {
            "#": resolve(__dirname)
        }
    }
}

export default config
