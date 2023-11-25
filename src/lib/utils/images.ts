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

export function formatImageFilename(isbn: number, side: "front" | "back", originalName: string): string {
    const extension = path.extname(originalName)
    return `${isbn}-${side}${extension}`
}


export async function saveImage(filename: string, content: ArrayBuffer): Promise<Error | void> {
    try {
        const filepath = path.join(IMAGES_PATH, filename)
        const buffer = Buffer.from(content)
        await saveFile(filepath, buffer)
    } catch (error) {
        return new Error(`Error saving image: ${filename}`)
    }
}

export async function deleteImage(filename: string): Promise<Error | void> {
    try {
        const filepath = path.join(IMAGES_PATH, filename)
        await fs.unlink(filepath)
    } catch (error) {
        return new Error(`Error deleting image: ${filename}`)
    }
}

export default saveImage
