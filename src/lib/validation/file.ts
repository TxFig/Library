import { z } from "zod"


const MBToBytes = (mb: number) => mb * 1000000
export const MAX_IMAGE_SIZE_MB = 16
export const MAX_IMAGE_SIZE_BYTES = MBToBytes(MAX_IMAGE_SIZE_MB)

const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
]

const fileOptionalSchema = z.instanceof(File)
    .refine(
        (file) => file.size <= MAX_IMAGE_SIZE_BYTES,
        `Image size can not exceeded ${MAX_IMAGE_SIZE_MB} MB`
    )
    .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .nullish()


export default fileOptionalSchema
