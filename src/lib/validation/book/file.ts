import { z } from "zod"
import { env } from "$env/dynamic/public"
import prettyBytes from "pretty-bytes"


const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
]

const DEFAULT_MAX_IMAGE_UPLOAD_SIZE = 16_000_000

const FileSchema = z.instanceof(File)
    .refine(
        (file) => file.size <= Number(env.PUBLIC_MAX_IMAGE_UPLOAD_SIZE),
        `Image size can not exceeded ${prettyBytes(Number(env.PUBLIC_MAX_IMAGE_UPLOAD_SIZE) || DEFAULT_MAX_IMAGE_UPLOAD_SIZE)}`
    )
    .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
    )


export default FileSchema
