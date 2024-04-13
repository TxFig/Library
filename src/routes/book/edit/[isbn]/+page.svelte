<script lang="ts">
    import type { ActionData, PageData, SubmitFunction } from "./$types"
    import { applyAction, enhance } from "$app/forms"

    import { page } from "$app/stores"
    import { getToastStore } from "@skeletonlabs/skeleton"

    import NotLoggedIn from "$lib/components/NotLoggedIn.svelte"
    import PublishDate from "$lib/components/book-form/PublishDate.svelte"
    import AutocompleteInputChip from "$lib/components/book-form/AutocompleteInputChip.svelte"
    import ImageInput from "$lib/components/book-form/ImageInput.svelte"
    import ListBoxInput from "$lib/components/book-form/ListBoxInput.svelte"
    import InputField from "$lib/components/book-form/InputField.svelte"
    import ErrorMessage from "$lib/components/book-form/ErrorMessage.svelte"

    import { BookUpdateSchemaDecodeInfo, BookUpdateSchema } from "$lib/validation/book-form"
    import type { z } from "zod";
    import { decode as decodeFormData } from "decode-formdata"
    import clearEmptyFields from "$lib/utils/clear-empty-fields"


    export let data: PageData
    const {
        book,
        allAuthors, allPublishers, allSubjects, allLocations, allLanguages
    } = data

    type FormattedError = z.inferFormattedError<typeof BookUpdateSchema>
    let errors: FormattedError | undefined = undefined
    export let form: ActionData
    $: errors = form?.errors

    const toastStore = getToastStore()

    const enhanceHandler: SubmitFunction = function({ formData, cancel }) {
        const decodedFormData = decodeFormData(formData, BookUpdateSchemaDecodeInfo)
        const data = clearEmptyFields(decodedFormData)

        const parsingResult = BookUpdateSchema.safeParse(data)
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
                    message: "Book Updated Successfully",
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
        <h2 class="h2">Book Editing</h2>

        <div>
            <InputField text="ISBN" name="isbn" type="number" value={book.isbn.toString()} required />
            <ErrorMessage errors={errors?.isbn}/>
        </div>
        <div>
            <InputField text="Title" name="title" required value={book.title}/>
            <ErrorMessage errors={errors?.title}/>
        </div>
        <div>
            <InputField text="Subtitle" name="subtitle" value={book.subtitle ?? ""}/>
            <ErrorMessage errors={errors?.subtitle}/>
        </div>
        <div>
            <InputField text="Number of Pages" name="number_of_pages" value={book.number_of_pages?.toString() ?? ""}/>
            <ErrorMessage errors={errors?.number_of_pages}/>
        </div>

        <PublishDate
            day={book.publish_date?.day}
            month={book.publish_date?.month}
            year={book.publish_date?.year}
            errors={errors?.publish_date}
        />

        <AutocompleteInputChip
            options={allAuthors.map(author => author.name)}
            selectedOptions={book.authors.map(author => author.name)}
            title="Authors"
            name="authors"
            placeholder="Enter authors..."
        />

        <AutocompleteInputChip
            options={allPublishers.map(publisher => publisher.name)}
            selectedOptions={book.publishers.map(publisher => publisher.name)}
            title="Publishers"
            name="publishers"
            placeholder="Enter publishers..."
        />

        <AutocompleteInputChip
            options={allSubjects.map(subject => subject.value)}
            selectedOptions={book.subjects.map(subject => subject.value)}
            title="Subjects"
            name="subjects"
            placeholder="Enter subjects..."
        />

        <div class="flex gap-6">
            <ImageInput title="Front Image" name="front_image" src={book.front_image ? `/images/${book.front_image}` : ""} />
            <ImageInput title="Back Image" name="back_image" src={book.back_image ? `/images/${book.back_image}` : ""} />
        </div>

        <ListBoxInput
            title="Book Location"
            name="location"
            options={allLocations.map(loc => loc.value)}
            selected={book.location?.value}
            placeholder="Enter location..."
        />

        <ListBoxInput
            title="Book Language"
            name="language"
            options={allLanguages.map(lang => lang.value)}
            selected={book.language?.value}
            placeholder="Enter language..."
        />

        <div class="flex justify-center gap-4 !mt-16">
            <a href={`/book/${book.isbn}`} class="btn variant-ghost-error px-10 py-3">Cancel</a>
            <button type="submit" class="btn variant-filled-primary px-10 py-3">Submit</button>
        </div>
    </form>
{:else}
    <NotLoggedIn/>
{/if}
