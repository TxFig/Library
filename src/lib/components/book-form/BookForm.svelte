<script lang="ts">
    import { goto } from "$app/navigation";
    import type { SuperFormCreateBook } from "$lib/server/api/book/POST";
    import type { Author, Language, Location, Publisher, Subject } from "@prisma/client";
    import { getToastStore } from "@skeletonlabs/skeleton";
    import SuperDebug, { superForm } from "sveltekit-superforms";
    import NumberInput from "../form/NumberInput.svelte";
    import TextInput from "../form/TextInput.svelte";
    import AutocompleteInputChip from "./AutocompleteInputChip.svelte";
    import ErrorMessage from "../form/ErrorMessage.svelte";
    import ImageInput from "./ImageInput.svelte";
    import ListBoxInput from "./ListBoxInput.svelte";
    import PublishDate from "./PublishDate.svelte";
    import { formISBNRegex } from "$lib/validation/book/isbn";
    import EditableCombobox from "../form/EditableCombobox.svelte";
    import Icon from "@iconify/svelte";


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
    $: $form.image = image
</script>


<!-- <SuperDebug data={$form} /> -->

<form
    method="post"
    enctype="multipart/form-data"
    use:enhance
    class="space-y-6 !mb-24"
>
    <div>
        <TextInput
            text="ISBN"
            name="isbn"
            bind:value={$form.isbn}
            allowedRegex={formISBNRegex}
            errors={$errors.isbn}
            required
            disabled={editing}
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

    <div class="flex flex-col md:flex-row justify-between [&>*]:w-full gap-8">
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
    </div>
    <div class="flex flex-col [&>*]:w-full md:flex-row md:[&>*]:w-1/2 justify-between gap-8">
        <AutocompleteInputChip
            options={allSubjects.map(subject => subject.value)}
            title="Subjects"
            name="subjects"
            placeholder="Enter subjects..."
            bind:selectedOptions={$form.subjects}
        />
        <div class="flex justify-between gap-8 [&>*]:w-1/2 [&>*]:h-fit">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="label">
                <p class="flex items-center gap-1">
                    <span>Book Location</span>
                    <Icon icon="mdi:location" width="16" />
                </p>
                <EditableCombobox
                    popupName="locationCombobox"
                    options={allLocations.map(loc => loc.value)}
                    bind:value={$form.location}
                    width="w-1/3 md:w-1/5"
                />
            </label>

            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="label">
                <p class="flex items-center gap-1">
                    <span>Book Language</span>
                    <Icon icon="mdi:language" width="16" />
                </p>
                <EditableCombobox
                    popupName="languageCombobox"
                    options={allLanguages.map(lang => lang.value)}
                    bind:value={$form.language}
                    width="w-1/3 md:w-1/5"
                />
            </label>
        </div>
    </div>

    <ImageInput name="image" bind:file={$form.image} />

    <div class="flex justify-center fixed bottom-4 w-full">
        <button type="submit" class="btn bg-primary-500 px-10 py-3">Submit</button>
    </div>
</form>
