import type { PrismaClient } from "@prisma/client"


const permissions = [
    { name: "Create Book", description: "Allows the user to add new books to the library."         },
    { name: "Edit Book"  , description: "Allows the user to change details of existing books."     },
    { name: "Delete Book", description: "Allows the use to remove books from the library."         },
    { name: "Borrow Book", description: "Allows the user to borrow books from the library."        },
    { name: "View Book"  , description: "Allows the user to view details of books in the library." },
    { name: "Admin"      , description: "Has access to the admin panel."                           }
] as const

type PermissionsNames = (typeof permissions)[number]["name"][]
type PermissionGroup = { name: string, description: string, permissions: PermissionsNames }
const permissionGroups: PermissionGroup[] = [
    {
        name: "Guest",
        description: "Guest User",
        permissions: ["View Book"]
    },
    {
        name: "Member",
        description: "Regular User",
        permissions: ["View Book", "Create Book", "Edit Book", "Borrow Book"]
    },
    {
        name: "Admin",
        description: "Administrator User",
        permissions: ["Create Book", "Edit Book", "Delete Book", "Borrow Book", "View Book", "Admin"]
    }
]

type Writeable<T> = { -readonly [P in keyof T]: T[P] }

async function seedPermissionsAndPermissionGroups(prisma: PrismaClient) {
    const permissionCount = await prisma.permission.count()
    if (permissionCount > 0)
        return

    await prisma.permission.createMany({
        data: permissions as Writeable<typeof permissions>
    })

    for (const permGroup of permissionGroups) {
        await prisma.permissionGroup.create({
            data: {
                name: permGroup.name,
                description: permGroup.description,
                permissions: {
                    connect: [
                        ...permGroup.permissions.map(name => ({ name }))
                    ]
                }
            }
        })
    }
}

export default seedPermissionsAndPermissionGroups
