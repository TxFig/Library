import { IMAGES_PATH } from "$env/static/private"
import { fail, type ActionFailure } from "@sveltejs/kit"
import fs from "fs/promises"
import path from "path"


export async function saveFile(
    filepath: string,
    content: Parameters<typeof fs.writeFile>[1]
): Promise<void> {
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
