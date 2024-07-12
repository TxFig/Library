async function fetchImageAsFile(url: string): Promise<File> {
    const res = await fetch(url)
    const arrayBuffer = await res.arrayBuffer()
    return new File([arrayBuffer], "")
}

export default fetchImageAsFile
