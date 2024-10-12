const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const idLength = 8
export function generatePublicId(): string {
    let id = ""

    for (let i = 0; i < idLength; i++) {
        const index = Math.floor(Math.random() * characters.length)
        id += characters.charAt(index)
    }

    return id
}

export default generatePublicId
