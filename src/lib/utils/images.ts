import { env } from "$env/dynamic/private"
import fs from "fs"
import path from "path"
import sharp from "sharp"
import type { ImageInput } from "$lib/server/database/books/image"
import { logError } from "$lib/server/database/logs"


function clearFolder(folder: string): void {
    const files = fs.readdirSync(folder)
    for (const file of files) {
        const filepath = path.join(folder, file)
        fs.rmSync(filepath)
    }
}

const resizeHeights = [1080, 720, 480, 320]
function possibleHeights(height: number): number[] {
    const heights = resizeHeights.filter(resizeHeight => resizeHeight <= height)
    if (heights.length === 0) {
        heights.push(height)
    }

    return heights
}

export async function generateResizedImages(bookPublicId: string, editionPublicId: string, file: File): Promise<ImageInput[]> {
    const arrayBuffer = await file.arrayBuffer()
    const image = sharp(arrayBuffer)

    let metadata = await image.metadata()
    if (!metadata.width || !metadata.height) {
        throw new Error(`Image file doesn't contain width or height`)
    }
    const size = {
        width: metadata.width,
        height: metadata.height
    }
    const heights = possibleHeights(size.height)

    const generatedSizes: ImageInput[] = []

    const folder = path.join(env.STATIC, "images", bookPublicId, editionPublicId)
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true })
    } else {
        clearFolder(folder)
    }

    for (const height of heights) {
        const filename = `${height}.webp`
        const filepath = path.join(folder, filename)
        const width = Math.round(size.width * height / size.height)
        try {
            await image
                .resize(width, height)
                .webp({ lossless: true })
                .toFile(filepath)

        } catch (err) {
            logError(err, "Error generating resized image")
        }
        generatedSizes.push({ width, height })
    }

    return generatedSizes
}

export async function deleteImagesFolder(bookPublicId: string, editionPublicId: string) {
    const folder = path.join(env.STATIC, "images", bookPublicId, editionPublicId)
    fs.rmSync(folder, { recursive: true, force: true })
}
