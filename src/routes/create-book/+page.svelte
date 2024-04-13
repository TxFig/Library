<script lang="ts">
    import type { ActionData, PageData, SubmitFunction } from "./$types"
    import { page } from "$app/stores"
    import { applyAction, enhance } from "$app/forms"

    import { getToastStore } from "@skeletonlabs/skeleton"

    import NotLoggedIn from "$lib/components/NotLoggedIn.svelte"
    import PublishDate from "$lib/components/book-form/PublishDate.svelte"
    import AutocompleteInputChip from "$lib/components/book-form/AutocompleteInputChip.svelte"
    import ImageInput from "$lib/components/book-form/ImageInput.svelte"
    import ListBoxInput from "$lib/components/book-form/ListBoxInput.svelte"
    import InputField from "$lib/components/book-form/InputField.svelte"
    import ErrorMessage from "$lib/components/book-form/ErrorMessage.svelte"

    import { BookCreateSchema, BookCreateSchemaDecodeInfo } from "$lib/validation/book-form"
    import { decode as decodeFormData } from "decode-formdata"
    import clearEmptyFields from "$lib/utils/clear-empty-fields"
    import type { z } from "zod"


    export let data: PageData
    let {
        authors: dbAuthors,
        publishers: dbPublishers,
        locations: dbLocations,
        subjects: dbSubjects,
        languages: dbLanguages
    } = data

    type FormattedError = z.inferFormattedError<typeof BookCreateSchema>
    let errors: FormattedError | undefined = undefined
    export let form: ActionData
    $: errors = form?.errors

    let isbn = $page.url.searchParams.get("isbn") ?? ""

    const toastStore = getToastStore()


    const enhanceHandler: SubmitFunction = function({ formData, cancel }) {
        const decodedFormData = decodeFormData(formData, BookCreateSchemaDecodeInfo)
        const data = clearEmptyFields(decodedFormData)

        const parsingResult = BookCreateSchema.safeParse(data)
        if (!parsingResult.success) {
            errors = parsingResult.error.format()
            cancel()
        }


        return async ({ result }) => {
            if (result.type == "failure" && result.data?.message) {
                toastStore.trigger({
                    message: result.data.message,
                    background: "variant-filled-error"
                })
            }
            else if (result.type == "redirect") {
                toastStore.trigger({
                    message: "Book Created Successfully",
                    background: "variant-filled-success"
                })
                await applyAction(result)
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
            <InputField text="ISBN" name="isbn" type="number" value={isbn} required />
            <ErrorMessage errors={errors?.isbn}/>
        </div>
        <div>
            <InputField text="Title" name="title" required />
            <ErrorMessage errors={errors?.title}/>
        </div>
        <div>
            <InputField text="Subtitle" name="subtitle" />
            <ErrorMessage errors={errors?.subtitle}/>
        </div>
        <div>
            <InputField text="Number of Pages" name="number_of_pages" />
            <ErrorMessage errors={errors?.number_of_pages}/>
        </div>

        <PublishDate errors={errors?.publish_date}/>

        <AutocompleteInputChip
            options={dbAuthors.map(author => author.name)}
            title="Authors"
            name="authors"
            placeholder="Enter authors..."
        />

        <AutocompleteInputChip
            options={dbPublishers.map(publisher => publisher.name)}
            title="Publishers"
            name="publishers"
            placeholder="Enter publishers..."
        />

        <AutocompleteInputChip
            options={dbSubjects.map(subject => subject.value)}
            title="Subjects"
            name="subjects"
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
