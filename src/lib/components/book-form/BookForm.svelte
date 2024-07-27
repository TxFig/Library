<script lang="ts">
    import { goto } from "$app/navigation";
    import type { SuperFormCreateBook } from "$lib/server/api/book/POST";
    import type { Author, Language, Location, Publisher, Subject } from "@prisma/client";
    import { getToastStore } from "@skeletonlabs/skeleton";
    import SuperDebug, { superForm } from "sveltekit-superforms";
    import NumberInput from "../NumberInput.svelte";
    import TextInput from "../TextInput.svelte";
    import AutocompleteInputChip from "./AutocompleteInputChip.svelte";
    import ErrorMessage from "./ErrorMessage.svelte";
    import ImageInput from "./ImageInput.svelte";
    import ListBoxInput from "./ListBoxInput.svelte";
    import PublishDate from "./PublishDate.svelte";
    import { formISBNRegex } from "$lib/validation/book/isbn";


    export let data: SuperFormCreateBook
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
    $: $form.image = image
</script>


<!-- <SuperDebug data={$form} /> -->

<form
    method="post"
    enctype="multipart/form-data"
    use:enhance
    class="space-y-6"
>
    <div>
        <TextInput
            text="ISBN"
            name="isbn"
            bind:value={$form.isbn}
            allowedRegex={formISBNRegex}
            errors={$errors.isbn}
            required
        />
        <ErrorMessage errors={$errors.isbn}/>
    </div>
    <div>
        <TextInput
            text="Title"
            name="title"
            bind:value={$form.title}
            errors={$errors.title}
            required
        />
        <ErrorMessage errors={$errors.title}/>
    </div>
    <div>
        <TextInput
            text="Subtitle"
            name="subtitle"
            bind:value={$form.subtitle}
            errors={$errors.subtitle}
        />
        <ErrorMessage errors={$errors.subtitle}/>
    </div>
    <div>
        <NumberInput
            text="Number of Pages"
            name="number_of_pages"
            bind:value={$form.number_of_pages}
            errors={$errors.number_of_pages}
        />
        <ErrorMessage errors={$errors.number_of_pages}/>
    </div>

    <PublishDate bind:dateObject={$form.publish_date} bind:errors={$errors.publish_date} />

    <AutocompleteInputChip
        options={allAuthors.map(author => author.name)}
        title="Authors"
        name="authors"
        placeholder="Enter authors..."
        bind:selectedOptions={$form.authors}
    />

    <AutocompleteInputChip
        options={allPublishers.map(publisher => publisher.name)}
        title="Publishers"
        name="publishers"
        placeholder="Enter publishers..."
        bind:selectedOptions={$form.publishers}
    />

    <AutocompleteInputChip
        options={allSubjects.map(subject => subject.value)}
        title="Subjects"
        name="subjects"
        placeholder="Enter subjects..."
        bind:selectedOptions={$form.subjects}
    />

    <ImageInput title="Image" name="image" bind:file={$form.image} />

    <ListBoxInput
        title="Book Location"
        name="location"
        options={allLocations.map(loc => loc.value)}
        placeholder="Enter location..."
        bind:selected={$form.location}
    />
    <ListBoxInput
        title="Book Language"
        name="language"
        options={allLanguages.map(lang => lang.value)}
        placeholder="Enter language..."
        bind:selected={$form.language}
    />

    <div class="flex justify-center !mt-16">
        <button type="submit" class="btn bg-primary-500 px-10 py-3">Submit</button>
    </div>
</form>
