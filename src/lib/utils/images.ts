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
