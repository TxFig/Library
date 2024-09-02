import { env } from "$env/dynamic/private"
import fs from "fs"
import path from "path"
import sharp from "sharp"
import type { BookImageInput } from "$lib/server/database/books/image"


function clearFolder(folder: string): void {
    const files = fs.readdirSync(folder)
    for (const file of files) {
        const filepath = path.join(folder, file)
        fs.rmSync(filepath)
    }
}

const resizeHeights = [1080, 720, 480, 320]
export async function generateResizedImages(isbn: string, file: File): Promise<BookImageInput[]> {
    const arrayBuffer = await file.arrayBuffer()
    const image = sharp(arrayBuffer)

    let metadata = await image.metadata()
    if (!metadata.width || !metadata.height) {
        // TODO: Handle Error
        throw new Error(`Image File of (isbn: ${isbn}) doesn't contain width or height`)
    }
    const size = {
        width: metadata.width,
        height: metadata.height
    }
    const heights = resizeHeights.filter(height => height <= size.height)
    if (heights.length === 0) heights.push(size.height)
    const generatedSizes: BookImageInput[] = []

    const folder = path.join(env.STATIC, "images", isbn)
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
            // console.log(err) // TODO: Log error
        }
        generatedSizes.push({ width, height })
    }

    return generatedSizes
}

export async function deleteImagesFolder(isbn: string) {
    const folder = path.join(env.STATIC, "images", isbn)
    fs.rmSync(folder, { recursive: true, force: true })
}
