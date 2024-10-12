import { HttpCodes, type HttpErrorCodesValues } from "$lib/utils/http-codes";
import type { Implements } from "$lib/utils/types";
import type { InternalApiMethodReturn } from "../..";
import db from "$lib/server/database/";
import { generateResizedImages } from "$lib/utils/images";
import log, { logError } from "$lib/logging";


export type BookImagePatchMethodReturn = Implements<InternalApiMethodReturn, {
    success: true
    message: string,
    data: null,
} | {
    success: false,
    code: HttpErrorCodesValues,
    message: string
}>

export async function PATCH(publicId: string, image: File, userId: number): Promise<BookImagePatchMethodReturn> {
    const book = await db.books.book.getUniqueBook({ where: { publicId } })
    if (!book) {
        return {
            success: false,
            code: HttpCodes.ClientError.NotFound,
            message: "Book Not Found"
        }
    }

    try {
        const imageSizes = await generateResizedImages(publicId, image)
        await db.books.image.updateBookImage(book.id, imageSizes)
        await log("info", `Book image updated: ${book.publicId}`, userId)
        return {
            success: true,
            message: "Book Image Updated Successfully",
            data: null
        }
    } catch (err) {
        await logError(err, `Error updating book image: ${book.publicId} in database`, userId)
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error updating book image in database"
        }
    }
}

export default PATCH
