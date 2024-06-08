import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()

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

async function seedPermissionsAndPermissionGroups() {
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

const subjects = [
    "Architecture", "Art Instruction", "Art History", "Dance", "Design",
    "Fashion", "Film", "Graphic Design", "Music", "Music Theory",
    "Painting", "Photography", "Bears", "Cats", "Kittens", "Dogs",
    "Puppies", "Fantasy", "Historical Fiction", "Horror", "Humor",
    "Literature", "Magic", "Mystery and detective stories", "Plays", "Poetry",
    "Romance", "Science Fiction", "Short Stories", "Thriller", "Young Adult",
    "Biology", "Chemistry", "Mathematics", "Physics", "Programming",
    "Management", "Entrepreneurship", "Business Economics", "Business Success", "Finance",
    "Kids Books", "Stories in Rhyme", "Baby Books", "Bedtime Books", "Picture Books",
    "Ancient Civilization", "Archaeology", "Anthropology", "World War II", "Social Life and Customs",
    "Cooking", "Cookbooks", "Mental Health", "Exercise", "Nutrition",
    "Self-help", "Autobiographies", "History", "Politics and Government", "Women",
    "Kings and Rulers", "Composers", "Artists", "Social Sciences", "Religion",
    "Political Science", "Psychology", "Geography", "Algebra", "Education",
    "Business & Economics", "Science", "English Language", "Computer Science"
]
async function seedSubjects() {
    await prisma.subject.createMany({
        data: [
            ...subjects.map(value => ({ value }))
        ]
    })
}

async function main() {
    const permissionCount = await prisma.permission.count()
    if (permissionCount == 0)
        await seedPermissionsAndPermissionGroups()

    const subjectsCount = await prisma.subject.count()
    if (subjectsCount == 0)
        await seedSubjects()
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (err) => {
        console.error(err)
        await prisma.$disconnect()
        process.exit(1)
    })
