<script lang="ts">
    import BookForm from "$lib/components/book-form/BookForm.svelte";
    import NotLoggedIn from "$lib/components/NotLoggedIn.svelte";
    import fetchImageAsFile from "$lib/utils/fetch-image-as-file";
    import { onMount } from "svelte";
    import type { PageData } from "./$types";


    export let data: PageData
    const { imageUrl } = data

    let image: File | undefined = undefined
    onMount(async () => {
        if (imageUrl) {
            image = await fetchImageAsFile(imageUrl, "image/webp") ?? undefined
        }
    })

</script>

{#if data.user}
    <div class="space-y-4 p-6">
        <h2 class="h2">Book Editing</h2>
        <BookForm
            data={data.form}
            image={image}
            allAuthors={data.allAuthors}
            allPublishers={data.allPublishers}
            allSubjects={data.allSubjects}
            allLocations={data.allLocations}
            allLanguages={data.allLanguages}
        />
    </div>
{:else}
    <NotLoggedIn />
{/if}
