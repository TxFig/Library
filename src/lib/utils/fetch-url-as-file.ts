async function fetchURLAsFile(url: string, filename: string = ""): Promise<File | null> {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            return null
        }

        const blob = await response.blob()
        return new File([blob], filename, {
            type: blob.type,
        })

    } catch (error) {
        return null
    }
}

export default fetchURLAsFile
