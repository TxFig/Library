import { z } from "zod"
import { env } from "$env/dynamic/public"
import prettyBytes from "pretty-bytes"


const DEFAULT_MAX_IMAGE_UPLOAD_SIZE = 16_000_000
export const FileSchema = z.instanceof(File)
    .refine(
        (file) => file.size <= Number(env.PUBLIC_MAX_IMAGE_UPLOAD_SIZE) || DEFAULT_MAX_IMAGE_UPLOAD_SIZE,
        `Image size can not exceeded ${prettyBytes(Number(env.PUBLIC_MAX_IMAGE_UPLOAD_SIZE) || DEFAULT_MAX_IMAGE_UPLOAD_SIZE)}`
    )

const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
]
export const ImageFileSchema = FileSchema
    .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        `File type must be one of ${ACCEPTED_IMAGE_TYPES.join(", ")}`
    )


export default FileSchema
