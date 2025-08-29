// import type { Prisma } from "@prisma/client"
// // import { BookCollectionEditionsInclude } from "../../../types"


// export const PageDataUserInclude = {
//     collections: {
//         include: {
//             editions: {
//                 include: {
//                     image: true
//                 }
//             }
//         }
//     },
//     permissionGroup: {
//         include: {
//             permissions: true
//         }
//     },
//     settings: true
// } as const
// export type PageDataUser = Prisma.UserGetPayload<{
//     include: typeof PageDataUserInclude
// }>

// export const DisplayUserInclude = {
//     readingStates: {
//         include: {
//             edition: {
//                 include: BookCollectionEditionsInclude
//             }
//         }
//     },
//     collections: {
//         include: {
//             editions: {
//                 include: BookCollectionEditionsInclude
//             },
//         }
//     },
//     permissionGroup: true,
//     settings: true
// } as const
// export type DisplayUser = Prisma.UserGetPayload<{
//     include: typeof DisplayUserInclude
// }>
