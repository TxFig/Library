import fs from "fs/promises"
import path from "path"


async function saveFile(filepath: string, content: Buffer): Promise<void> {
    try {
        const folder = path.dirname(filepath)
        await fs.mkdir(folder)

        fs.writeFile(filepath, content, "utf-8")
    } catch (error: any /* Nodejs ErrnoException */) {
        if (error.code == "EEXIST")
            return
        throw error
    }
}


export default saveFile
