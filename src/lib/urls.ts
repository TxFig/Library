type HomePageParams = "author" | "subject" | "publish_year" | "language" | "publisher" | "author" | "location"

function param(key: string, value?: string): string {
    if (!value) return ""
    return `${key}=${value}`
}

function genParams(params?: Record<string, string>): string {
    if (!params) return ""
    const entries = Object.entries(params)
    if (entries.length === 0) return ""
    return "?" + entries
        .map(([key, value]) => param(key, value))
        .join("&")
}

export default {
    homePage: (params?: Partial<Record<HomePageParams, string>>) =>
        `/${genParams(params)}`,

    bookPage: (bookPublicId: string, editionPublicId?: string) =>
        `/book/${bookPublicId}${
            genParams(editionPublicId ? { edition: editionPublicId } : undefined)
        }`,

    bookCreate: (isbn?: string) =>
        `/book/create${genParams(isbn ? { isbn } : undefined)}`,

    bookEdit: (bookPublicId: string, isbn?: string) =>
        `/book/${bookPublicId}/edit${genParams(isbn ? { isbn } : undefined)}`,

    userPage: (username: string) =>
        `/user/${username}`,

    dashboard: {
        copies: `/dashboard/copies`,
        requests: `/dashboard/copies?tab=requests`
    }

} as const
