<script lang="ts">
    import type { PageData } from "./$types"
    import { page } from "$app/stores"
    import { enhance } from "$app/forms"
    import type { SubmitFunction } from "@sveltejs/kit"
    import { goto } from "$app/navigation"

    import { getToastStore } from "@skeletonlabs/skeleton"

    import NotLoggedIn from "$lib/components/NotLoggedIn.svelte"
    import PublishDate from "$lib/components/book-form/PublishDate.svelte"
    import AutocompleteInputChip from "$lib/components/book-form/AutocompleteInputChip.svelte"
    import ImageInput from "$lib/components/book-form/ImageInput.svelte"
    import ListBoxInput from "$lib/components/book-form/ListBoxInput.svelte"


    export let data: PageData
    let {
        authors: dbAuthors,
        publishers: dbPublishers,
        locations: dbLocations,
        subjects: dbSubjects,
        languages: dbLanguages
    } = data

    let isbn = $page.url.searchParams.get("isbn")

    const toastStore = getToastStore()

    const enhanceHandler: SubmitFunction<
        Record<string, any>,
        { message: string }
    > = function({ formData }) {

        for (const [key, value] of Array.from(formData.entries())) {
            if ((typeof value == "string" && value == "") ||
            (typeof value == "object" && (value as File).name == "")
            ) {
                formData.delete(key)
            }
        }

        return ({ result }) => {
            if (result.type == "failure" && result.data?.message) {
                toastStore.trigger({
                    message: result.data.message,
                    background: "variant-filled-error"
                })
            }
            else if (result.type == "redirect") {
                toastStore.trigger({
                    message: "Book Creating Successful",
                    background: "variant-filled-success"
                })
                goto(result.location)
            }
        }
    }
</script>

{#if $page.data.user}
    <form
        class="space-y-6"
        method="post"
        enctype="multipart/form-data"
        use:enhance={enhanceHandler}
    >
        <h2 class="h2">Book Creation</h2>

        <label class="label">
            <span>ISBN<sup class="text-red-500">*</sup></span>
            <input class="input" type="number" name="isbn" bind:value={isbn} required/>
        </label>

        <label class="label">
            <span>Title<sup class="text-red-500">*</sup></span>
            <input class="input" type="text" name="title" required />
        </label>

        <label class="label">
            <span>Subtitle</span>
            <input class="input" type="text" name="subtitle" />
        </label>

        <label class="label">
            <span>Number of pages</span>
            <input class="input" type="number" name="number_of_pages" />
        </label>

        <PublishDate/>

        <AutocompleteInputChip
            options={dbAuthors.map(author => author.name)}
            title="Authors"
            name="author"
            placeholder="Enter authors..."
        />

        <AutocompleteInputChip
            options={dbPublishers.map(publisher => publisher.name)}
            title="Publishers"
            name="publisher"
            placeholder="Enter publishers..."
        />

        <AutocompleteInputChip
            options={dbSubjects.map(subject => subject.value)}
            title="Subjects"
            name="subject"
            placeholder="Enter subjects..."
        />

        <div class="flex gap-6">
            <ImageInput title="Front Image" name="front_image" />
            <ImageInput title="Back Image" name="back_image" />
        </div>

        <ListBoxInput
            title="Book Location"
            name="location"
            options={dbLocations.map(loc => loc.value)}
            placeholder="Enter location..."
        />
        <ListBoxInput
            title="Book Language"
            name="language"
            options={dbLanguages.map(lang => lang.value)}
            placeholder="Enter language..."
        />

        <div class="flex justify-center !mt-16">
            <button type="submit" class="btn bg-primary-500 px-10 py-3">Submit</button>
        </div>
    </form>
{:else}
    <NotLoggedIn/>
{/if}
