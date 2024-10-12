<script lang="ts">
    import { goto } from "$app/navigation";
    import type { SuperFormCreateBook } from "$lib/server/api/book/POST";
    import type { Author, Language, Location, Publisher, Subject } from "@prisma/client";
    import { getToastStore } from "@skeletonlabs/skeleton";
    import SuperDebug, { superForm } from "sveltekit-superforms";
    import NumberInput from "$lib/components/form/NumberInput.svelte";
    import TextInput from "$lib/components/form/TextInput.svelte";
    import AutocompleteInputChip from "$lib/components/book-form/AutocompleteInputChip.svelte";
    import ErrorMessage from "$lib/components/form/ErrorMessage.svelte";
    import ImageInput from "$lib/components/book-form/ImageInput.svelte";
    import PublishDate from "$lib/components/book-form/PublishDate.svelte";
    import { formISBNRegex } from "$lib/validation/book/isbn";
    import EditableComboboxField from "$lib/components/form/EditableComboboxField.svelte";
    import FetchSimilarBooksByTitle from "./FetchSimilarBooksByTitle.svelte";
    import type { BookCopySchemaInput } from "$lib/validation/book/book";


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

        onUpdated({ form: { message, data } }) {
            if (!message) return
            const variant = message.type === "success" ? "variant-filled-success" : "variant-filled-error"
            toastStore.trigger({
                message: message.text,
                background: variant
            })

            if (message.type === "success") {
                goto(`/book/${data.isbn}`)
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

    let copy = $form.copy ?? {} as BookCopySchemaInput
    $: $form.copy = copy
</script>


<SuperDebug data={$form} />

<form
    method="post"
    enctype="multipart/form-data"
    use:enhance
    class="space-y-6 !mb-24"
>
    <h3 class="h3">Book Properties</h3>
    <div class="flex flex-col md:flex-row justify-between [&>*]:w-full gap-8">
        <div>
            <AutocompleteInputChip
                options={allAuthors.map(author => author.name)}
                title="Authors"
                name="authors"
                placeholder="Enter authors..."
                bind:selectedOptions={$form.book.authors}
                errors={$errors.book?.authors?._errors}
                required
            />
            <ErrorMessage errors={$errors.book?.authors?._errors}/>
        </div>
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
        <TextInput
            text="Title"
            name="title"
            bind:value={$form.edition.title}
            errors={$errors.edition?.title}
            required
        />
        <ErrorMessage errors={$errors.edition?.title}/>
        <FetchSimilarBooksByTitle title={$form.edition.title} />
    </div>
    <PublishDate bind:dateObject={$form.edition.publishDate} errors={$errors.edition?.publishDate} />
    <div>
        <EditableComboboxField
            text="Book Language"
            name="language"
            options={allLanguages.map(lang => lang.value)}
            bind:value={$form.edition.language}
            class="w-1/4"
            optionsWidth="w-1/4"
            icon="mdi:language"
            errors={$errors.edition?.language}
            required
        />
        <ErrorMessage errors={$errors.edition?.language}/>
    </div>

    <div>
        <TextInput
            text="ISBN"
            name="isbn"
            bind:value={$form.edition.isbn}
            allowedRegex={formISBNRegex}
            errors={$errors.edition?.isbn?._errors}
            disabled={editing}
        />
        <ErrorMessage errors={$errors.edition?.isbn?._errors}/>
    </div>
    <div>
        <TextInput
            text="Subtitle"
            name="subtitle"
            bind:value={$form.edition.subtitle}
            errors={$errors.edition?.subtitle?._errors}
        />
        <ErrorMessage errors={$errors.edition?.subtitle?._errors}/>
    </div>
    <div>
        <NumberInput
            text="Number of Pages"
            name="numberOfPages"
            bind:value={$form.edition.numberOfPages}
            errors={$errors.edition?.numberOfPages}
        />
        <ErrorMessage errors={$errors.edition?.numberOfPages?._errors}/>
    </div>
    <div class="flex flex-col [&>*]:w-full md:flex-row md:[&>*]:w-1/2 justify-between gap-8">
        <AutocompleteInputChip
            options={allAuthors.map(author => author.name)}
            title="Additional Authors"
            name="editionAuthors"
            placeholder="Enter authors..."
            bind:selectedOptions={$form.edition.authors}
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
        bind:value={copy.location}
        class="w-1/4"
        optionsWidth="w-1/4"
    />

    <div class="flex justify-center fixed bottom-4 w-full">
        <button type="submit" class="btn bg-primary-500 px-10 py-3">Submit</button>
    </div>
</form>
