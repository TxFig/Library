import { IMAGES_PATH } from "$env/static/private"
import { fail, type ActionFailure } from "@sveltejs/kit"
import fs from "fs/promises"
import path from "path"


/**
 * Tries to create a directory in `path`.
 * If the directory already exists it does nothing and doesn't throw an error
 */
async function mkdir(path: string): Promise<void> {
    try {
        await fs.mkdir(path)
    } catch (error: any /* Nodejs ErrnoException */) {
        if (error.code == "EEXIST") return
        throw error
    }
}

export async function saveFile(
    filepath: string,
    content: Parameters<typeof fs.writeFile>[1]
): Promise<void> {
        const folder = path.dirname(filepath)
        await mkdir(folder)

        fs.writeFile(filepath, content, "utf-8")
}

export function formatImageFilename(isbn: string, side: "front" | "back", originalName: string): string {
    const extension = originalName.split(".").pop()
    return `${isbn}-${side}.${extension}`
}


export async function saveImage(filename: string, content: Buffer): Promise<
    ActionFailure<{ message: string }> | undefined
> {
    try {
        const filepath = path.join(IMAGES_PATH, filename)
        await saveFile(filepath, content)
    } catch (error) {
        return fail(500, {
            message: "Error saving front image"
        })
    }
}

export default saveImage
