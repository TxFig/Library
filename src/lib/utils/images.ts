import { IMAGES_PATH } from "$env/static/private"
import fs from "fs/promises"
import path from "path"
import sharp from "sharp"


export async function saveFile(
    filepath: string,
    content: Parameters<typeof fs.writeFile>[1]
): Promise<void> {
        fs.writeFile(filepath, content, "utf-8")
}

export function formatImageFilename(isbn: bigint, side: "front" | "back", originalName: string): string {
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

const resizeHeights = [1080, 720, 480, 360]
export async function generateResizedImages(isbn: bigint, side: "front" | "back", file: File): Promise<string[]> {
    const images: string[] = []
    const arrayBuffer = await file.arrayBuffer()
    const image = sharp(arrayBuffer)

    let metadata = await image.metadata()


    if (!metadata.width || !metadata.height) {
        throw new Error(`Image File of (isbn: ${isbn}, size: ${side}) doesn't contain width or height`)
    }
    const size = {
        width: metadata.width,
        height: metadata.height
    }
    const heights = resizeHeights.filter(height => height < size.height)

    for (const height of heights) {
        const filename = `${isbn}-${side}-${height}p.webp`
        const filepath = path.join(IMAGES_PATH, filename)
        images.push(filename)

        try {
            const outputInfo = await image
                .resize(null, height)
                .webp({ lossless: true })
                .toFile(filepath)
        } catch (error) {
            console.log("sharp error", error)
        }

    }


    return images
}
