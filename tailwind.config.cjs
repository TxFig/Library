/** @type {import('tailwindcss').Config}*/
const { skeleton } = require('@skeletonlabs/tw-plugin')
const path = require("path")

const config = {
    content: [
        "./src/**/*.{html,js,svelte,ts}",
        path.join(
            require.resolve("@skeletonlabs/skeleton"),
            "../**/*.{html,js,svelte,ts}"
        ),
    ],

    theme: {
        extend: {},
    },

    plugins: [
        require("@tailwindcss/forms"),
        skeleton({
            themes: { preset: [{
                name: "vintage",
                enhancements: true
            }]}
        }),
    ],

    darkMode: "class",
}

module.exports = config
