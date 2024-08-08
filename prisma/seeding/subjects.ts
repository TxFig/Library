import type { PrismaClient } from "@prisma/client"

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

async function seedSubjects(prisma: PrismaClient) {
    const subjectsCount = await prisma.subject.count()
    if (subjectsCount > 0)
        return

    await prisma.subject.createMany({
        data: [
            ...subjects.map(value => ({ value }))
        ]
    })
}

export default seedSubjects
