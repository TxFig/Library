// import type { UserCreateFormData, UserUpdateFormData } from "$lib/_validation/auth/user"
import type { Prisma, User } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import prisma from "$lib/server/database/prisma"
import applyTransformSpec, { type ApplyTransformSpec } from "$lib/utils/transform-object"
import { userTransform } from "$lib/transforms"


// export async function createUser(data: UserCreateFormData): Promise<User> {
//     const { permissionGroup, ...user } = data

//     return await prisma.user.create({
//         data: {
//             ...user,
//             permissionGroup: {
//                 connect: {
//                     name: permissionGroup
//                 }
//             },
//             settings: {
//                 create: {
//                     visibleReadingState: true
//                 }
//             }
//         }
//     })
// }

// export async function updateUser(publicId: string, data: UserUpdateFormData): Promise<User> {
//     const { permissionGroup, ...user } = data

//     return await prisma.user.update({
//         where: { publicId },
//         data: {
//             ...user,
//             permissionGroup: {
//                 connect: {
//                     name: permissionGroup
//                 }
//             }
//         }
//     })
// }

export async function deleteUser(publicId: string): Promise<User> {
    return await prisma.user.delete({
        where: { publicId }
    })
}

export function getUnique<T extends Prisma.UserFindUniqueArgs>(
    ...args: Parameters<typeof prisma.user.findUnique<T>>
) {
    return prisma.user.findUnique<T>(...args)
}

export function getAll<T extends Prisma.UserFindManyArgs>(
    ...args: Parameters<typeof prisma.user.findMany<T>>
) {
    return prisma.user.findMany<T>(...args)
}

export function getCount<T extends Prisma.UserCountArgs>(
    ...args: Parameters<typeof prisma.user.count<T>>
) {
    return prisma.user.count<T>(...args)
}

export async function getAllTransformed() {
    return applyTransformSpec(
        await getAll(),
        { $: userTransform }
    )
}
export type UserTransformed = ApplyTransformSpec<User, { $: typeof userTransform }>

export default {
    // createUser,
    // updateUser,
    deleteUser,

    getUnique,
    getAll,
    getCount,

    getAllTransformed
}
