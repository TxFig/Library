import * as v from "valibot"
import { PublicIdSchema } from "../publicId"
import { NumberSchema } from "../utils"


//* Copy
export const copyUpdateStatuses = ["available", "unavailable"] as const
export type CopyUpdateStatus = typeof copyUpdateStatuses[number]
export const CopyUpdateSchema = v.object({
    status: v.picklist(copyUpdateStatuses)
})
export type CopyUpdateSchema = typeof CopyUpdateSchema


//* Copy Request
export const minDays = 7
export const maxDays = 60
export const CopyRequestCreateSchema = v.object({
    startDate: v.pipe(
        v.string(),
        v.isoTimestamp(),
        v.check(date => {
            const now = new Date(new Date().toISOString().split('T')[0])
            return new Date(date) >= now
        })
    ),
    duration: NumberSchema,
})
export type CopyRequestCreateSchema = typeof CopyRequestCreateSchema

export const CopyRequestUpdateSchema = v.object({
    status: v.picklist(["cancelled"])
})
export type CopyRequestUpdateSchema = typeof CopyRequestUpdateSchema


//* Copy Loan
const copyLoanUpdateStatuses = ["cancelled"] as const
export const CopyLoanUpdateSchema = v.object({
    status: v.picklist(copyLoanUpdateStatuses)
})
export type CopyLoanUpdateSchema = typeof CopyLoanUpdateSchema
