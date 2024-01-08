import { IMAGES_PATH } from "$env/static/private"
import fs from "fs"
import fsPromises from "fs/promises"
import path from "path"
import sharp from "sharp"
import { BadRequestError, InternalServerError } from "./custom-errors"


export async function saveFile(
    filepath: string,
    content: Parameters<typeof fsPromises.writeFile>[1]
): Promise<void> {
    fsPromises.writeFile(filepath, content, "utf-8")
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
        await fsPromises.unlink(filepath)
    } catch (error) {
        return new Error(`Error deleting image: ${filename}`)
    }
}

const resizeHeights = [1080, 720, 480, 320]
export async function generateResizedImages(isbn: bigint, side: "front" | "back", file: File): Promise<void> {
    const arrayBuffer = await file.arrayBuffer()
    const image = sharp(arrayBuffer)

    let metadata = await image.metadata()


    if (!metadata.width || !metadata.height) {
        throw new BadRequestError(`Image File of (isbn: ${isbn}, size: ${side}) doesn't contain width or height`)
    }
    const size = {
        width: metadata.width,
        height: metadata.height
    }
    const heights = resizeHeights.filter(height => height < size.height)

    for (const height of heights) {
        const folder = path.join(IMAGES_PATH, isbn.toString(), side)
        const filename = `${height.toString()}.webp`
        const filepath = path.join(folder, filename)

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true })
        }

        try {
            await image
                .resize(null, height)
                .webp({ lossless: true })
                .toFile(filepath)
        } catch {
            // TODO log information
            throw new InternalServerError()
        }
    }
}
