import db from "$lib/server/database/"


process.on("exit", () => {
    db.close()
})
