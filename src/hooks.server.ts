import { close } from "$lib/server/database/"


process.on("exit", () => {
    close()
})
