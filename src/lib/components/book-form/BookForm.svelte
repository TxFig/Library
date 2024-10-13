<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores"
    import type { SuperFormCreateBook } from "$lib/server/api/book/POST";
    import type { Author, Language, Location, Publisher, Subject } from "@prisma/client";
    import { getToastStore } from "@skeletonlabs/skeleton";
    import SuperDebug, { superForm, fieldProxy } from "sveltekit-superforms";
    import NumberInput from "$lib/components/form/NumberInput.svelte";
    import TextInput from "$lib/components/form/TextInput.svelte";
    import AutocompleteInputChip from "$lib/components/book-form/AutocompleteInputChip.svelte";
    import ErrorMessage from "$lib/components/form/ErrorMessage.svelte";
    import ImageInput from "$lib/components/book-form/ImageInput.svelte";
    import PublishDate from "$lib/components/book-form/PublishDate.svelte";
    import { formISBNRegex } from "$lib/validation/book/isbn";
    import EditableComboboxField from "$lib/components/form/EditableComboboxField.svelte";
    import FetchSimilarBooksByTitle from "./FetchSimilarBooksByTitle.svelte";


    export let data: SuperFormCreateBook
    export let editing: boolean = false
    export let allAuthors: Author[]
    export let allPublishers: Publisher[]
    export let allSubjects: Subject[]
    export let allLocations: Location[]
    export let allLanguages: Language[]

    const toastStore = getToastStore()

    const { form, errors, enhance } = superForm(data, {
        dataType: "json",
        stickyNavbar: ".app-bar",
        scrollToError: {
            behavior: "smooth",
            block: "center",
        },

        onResult({ result }) {
            if (result.type === "redirect") {
                toastStore.trigger({
                    message: "Book Created Successfully",
                    background: "variant-filled-success"
                })
            }
        },

        onError({ result }) {
            toastStore.trigger({
                message: result.error.message,
                background: "variant-filled-error"
            })
        }
    })

    export let image: File | undefined = undefined
    $: $form.edition.image = image

    $form.edition.isbn = $page.url.searchParams.get("isbn") ?? undefined

    const publishDate = fieldProxy(form, "edition.publishDate")
</script>


<!-- <SuperDebug data={$form} /> -->

<form
    method="post"
    enctype="multipart/form-data"
    use:enhance
    class="space-y-6 !mb-24"
>
    <h3 class="h3">Book Properties</h3>
    <div class="flex flex-col md:flex-row justify-between [&>*]:w-full gap-8">
        <ErrorMessage errors={$errors.book?.authors}>
            <AutocompleteInputChip
                options={allAuthors.map(author => author.name)}
                title="Authors"
                name="authors"
                placeholder="Enter authors..."
                bind:selectedOptions={$form.book.authors}
                required
            />
        </ErrorMessage>
        <AutocompleteInputChip
            options={allSubjects.map(subject => subject.value)}
            title="Subjects"
            name="subjects"
            placeholder="Enter subjects..."
            bind:selectedOptions={$form.book.subjects}
        />
    </div>

    <hr>
    <h3 class="h3">Book Edition Properties</h3>
    <div>
        <ErrorMessage errors={$errors.edition?.title}>
            <TextInput
                text="Title"
                name="title"
                bind:value={$form.edition.title}
                required
            />
        </ErrorMessage>
        <FetchSimilarBooksByTitle title={$form.edition.title} />
    </div>

    <PublishDate proxy={publishDate} errors={$errors.edition?.publishDate} />

    <ErrorMessage errors={$errors.edition?.language}>
        <EditableComboboxField
            text="Book Language"
            name="language"
            options={allLanguages.map(lang => lang.value)}
            bind:value={$form.edition.language}
            class="w-1/4"
            optionsWidth="w-1/4"
            icon="mdi:language"
            required
        />
    </ErrorMessage>

    <div>
        <ErrorMessage errors={$errors.edition?.isbn}>
            <TextInput
                text="ISBN"
                name="isbn"
                bind:value={$form.edition.isbn}
                allowedRegex={formISBNRegex}
                disabled={editing}
            />
        </ErrorMessage>
    </div>
    <div>
        <ErrorMessage errors={$errors.edition?.subtitle}>
            <TextInput
                text="Subtitle"
                name="subtitle"
                bind:value={$form.edition.subtitle}
            />
        </ErrorMessage>
    </div>
    <div>
        <ErrorMessage errors={$errors.edition?.numberOfPages}>
            <NumberInput
                text="Number of Pages"
                name="numberOfPages"
                bind:value={$form.edition.numberOfPages}
            />
        </ErrorMessage>
    </div>
    <div class="flex flex-col [&>*]:w-full md:flex-row md:[&>*]:w-1/2 justify-between gap-8">
        <AutocompleteInputChip
            options={allAuthors.map(author => author.name)}
            title="Additional Authors"
            name="editionAuthors"
            placeholder="Enter authors..."
            bind:selectedOptions={$form.edition.additionalAuthors}
        />
        <AutocompleteInputChip
            options={allPublishers.map(publisher => publisher.name)}
            title="Publishers"
            name="publishers"
            placeholder="Enter publishers..."
            bind:selectedOptions={$form.edition.publishers}
        />
    </div>
    <ImageInput name="image" bind:file={$form.edition.image} />

    <hr>
    <h3 class="h3">Book Copy Properties</h3>
    <EditableComboboxField
        text="Book Location"
        name="location"
        icon="mdi:location"
        options={allLocations.map(loc => loc.value)}
        bind:value={$form.copy.location}
        class="w-1/4"
        optionsWidth="w-1/4"
    />

    <div class="flex justify-center fixed bottom-4 w-full">
        <button type="submit" class="btn bg-primary-500 px-10 py-3">Submit</button>
    </div>
</form>
