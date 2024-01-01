<script>
    import { page } from "$app/stores";
    import { CodeBlock } from "@skeletonlabs/skeleton";

</script>
<div class="flex flex-col gap-4">
    <p class="text-2xl font-mono">/api/book/</p>

    <ul class="list-disc ml-8 space-y-8">
        <li>
            <p>POST</p>
            <p>Creates a new book entry</p>
            <div class="flex w-full">
                <CodeBlock language="typescript" code={
`// Request Body Type
type RequestBody = {
    isbn: bigint

    title: string
    subtitle?: string
    number_of_pages?: number

    isbn10?: bigint
    isbn13?: bigint

    front_image?: File
    back_image?: File

    year?: number
    month?: number
    day?: number

    location?: string
    language?: string
    authors?: string[]
    publishers?: string[]
    subjects?: string[]
}`
                } buttonCopied="Copied" class="grow"/>
                <CodeBlock language="typescript" code={
`// Example
const response = await fetch("${$page.url.href}", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        isbn: 9876543210,

        title: "My Favorite Book",
        number_of_pages: 123,

        year: 2023,
        month: 12,

        location: "My House",
        language: "EN",

        authors: ["Me", "Also Me"],
        publishers: ["Not Me"],
    })
})`
                } buttonCopied="Copied" class="grow"/>
            </div>
        </li>
        <li>GET</li>
        <li>PATCH</li>
        <li>DELETE</li>
    </ul>
</div>
