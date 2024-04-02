<script lang="ts">
    import type { ActionData, PageData } from "./$types"
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
    import InputField from "./InputField.svelte"
    import ErrorMessage from "$lib/components/book-form/ErrorMessage.svelte"

    import { bookCreateSchema } from "$lib/validation/book-form"
    import { decode as decodeFormData } from "decode-formdata"
    import type { z } from "zod"



    export let data: PageData
    let {
        authors: dbAuthors,
        publishers: dbPublishers,
        locations: dbLocations,
        subjects: dbSubjects,
        languages: dbLanguages
    } = data

    // export let form: ActionData

    let isbn = $page.url.searchParams.get("isbn") ?? ""

    const toastStore = getToastStore()

    type FormatterError = z.inferFormattedError<typeof bookCreateSchema>
    let errors: FormatterError = {} as FormatterError

    const enhanceHandler: SubmitFunction = function({ formData, cancel }) {

        //* https://kit.svelte.dev/docs/form-actions
        // TODO: validate data client-side
            // on error focus first invalid element
            // and show error messages on all invalid elements

        const data = decodeFormData(formData, {
            arrays: ["author", "publisher", "subject"],
            files: ["front_image", "back_image"],
            numbers: ["isbn", "number_of_pages", "publish_date.day", "publish_date.month", "publish_date.year"]
        })
        const parsingResult = bookCreateSchema.safeParse(data)

        if (!parsingResult.success) {
            errors = parsingResult.error.format()
            cancel()
        }

        return async ({ result, update }) => {
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
            } else {
                await update()
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

        <div>
            <InputField text="ISBN" name="isbn" type="number" bind:value={isbn} required />
            <ErrorMessage bind:errors={errors.isbn}/>
        </div>
        <div>
            <InputField text="Title" name="title" required />
            <ErrorMessage bind:errors={errors.title}/>
        </div>
        <div>
            <InputField text="Subtitle" name="subtitle" />
            <ErrorMessage bind:errors={errors.subtitle}/>
        </div>
        <div>
            <InputField text="Number of Pages" name="number_of_pages" />
            <ErrorMessage bind:errors={errors.number_of_pages}/>
        </div>

        <PublishDate />

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
