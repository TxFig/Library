import * as v from "valibot"
import { env } from "$env/dynamic/public"
import prettyBytes from "pretty-bytes"


const DEFAULT_MAX_UPLOAD_SIZE = 16_000_000
const MAX_FILE_SIZE = Number(env.PUBLIC_MAX_IMAGE_UPLOAD_SIZE) || DEFAULT_MAX_UPLOAD_SIZE
export const FileSchema = v.pipe(
    v.file(),
    v.maxSize(
        MAX_FILE_SIZE,
        `Image size can not exceed ${prettyBytes(MAX_FILE_SIZE)}`
    )
)

export const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
] as const
export const ImageFileSchema = v.pipe(
    FileSchema,
    v.mimeType(
        ACCEPTED_IMAGE_TYPES,
        `File type must be one of ${ACCEPTED_IMAGE_TYPES.join(", ")}`
    )
)

export const UrlSchema = v.pipe(v.string(), v.url())


export default FileSchema
