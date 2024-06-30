<script lang="ts">
    import type { ActionData, ActionsExport, PageData } from "./$types"
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

    import { BookCreateSchema, BookCreateSchemaDecodeInfo } from "$lib/validation/book/book-form"
    import type { z } from "zod"
    import SubmitFunctionFactory from "$lib/utils/submit-function-factory"


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

    const submitFunction = SubmitFunctionFactory<ActionsExport>(
        BookCreateSchema, BookCreateSchemaDecodeInfo,
        (error) => {
            errors = error.format()
        },
        async (result) => {
            if (result.type == "failure"  && result.data?.message) {
                toastStore.trigger({
                    message: result.data.message,
                    background: "variant-filled-error"
                })
            }
            else if (result.type == "error") {
                toastStore.trigger({
                    message: result.error.message,
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
    )
</script>

{#if $page.data.user}
    <form
        class="space-y-6"
        method="post"
        enctype="multipart/form-data"
        use:enhance={submitFunction}
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
