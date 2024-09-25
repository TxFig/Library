import HttpCodes from "./http-codes"


async function fetchImageAsFile(url: string, mimeType?: string, fetchFunction = fetch): Promise<File | null> {
    try {
        const res = await fetchFunction(url)
        if (res.status === HttpCodes.Success) {
            const arrayBuffer = await res.arrayBuffer()
            return new File([arrayBuffer], "", {
                type: mimeType
            })
        } else {
            return null
        }
    } catch (err) {
        console.error(err)
        return null
    }
}

export default fetchImageAsFile
