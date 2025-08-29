import type { UserConfig } from "vite"
import { sveltekit } from "@sveltejs/kit/vite"
import { purgeCss } from "vite-plugin-tailwind-purgecss"


const config: UserConfig = {
    plugins: [sveltekit(), purgeCss()]
}

export default config
