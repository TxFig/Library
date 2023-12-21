<script lang="ts">
    import type { PageData } from "./$types"
    import { enhance } from "$app/forms"

    import PublishDate from "$lib/components/book-form/PublishDate.svelte"
    import AutocompleteInputChip from "$lib/components/book-form/AutocompleteInputChip.svelte"
    import ImageInput from "$lib/components/book-form/ImageInput.svelte"
    import ListBoxInput from "$lib/components/book-form/ListBoxInput.svelte"


    export let data: PageData
    const {
        book,
        allAuthors, allPublishers, allSubjects, allLocations, allLanguages
    } = data


    function onFormData(ev: FormDataEvent) {
        const formData = ev.formData

        for (const [key, value] of [...formData.entries()]) {
            if ((typeof value == "string" && value == "") ||
                (typeof value == "object" && (value as File).name == "")
            ) {
                formData.delete(key)
            }
        }

        formData.set("isbn", book.isbn.toString())
    }

</script>

<form class="space-y-6" method="post" use:enhance enctype="multipart/form-data" on:formdata={onFormData}>
    <h2 class="h2">Book Editing</h2>

    <label class="label">
        <span>ISBN</span>
        <input class="input" type="number" name="isbn" value={book.isbn} required disabled/>
    </label>

    <label class="label">
        <span>Title<sup class="text-red-500">*</sup></span>
        <input class="input" type="text" name="title" required value={book.title} />
    </label>

    <label class="label">
        <span>Subtitle</span>
        <input class="input" type="text" name="subtitle" value={book.subtitle} />
    </label>

    <label class="label">
        <span>Number of pages</span>
        <input class="input" type="number" name="number_of_pages" value={book.number_of_pages}/>
    </label>

    <PublishDate
        day={book.publish_date?.getDay()}
        month={book.publish_date?.getMonth()}
        year={book.publish_date?.getFullYear()}
    />

    <AutocompleteInputChip
        options={allAuthors.map(author => author.name)}
        selectedOptions={book.authors.map(author => author.name)}
        title="Authors"
        name="author"
        placeholder="Enter authors..."
    />

    <AutocompleteInputChip
        options={allPublishers.map(publisher => publisher.name)}
        selectedOptions={book.publishers.map(publisher => publisher.name)}
        title="Publishers"
        name="publisher"
        placeholder="Enter publishers..."
    />

    <AutocompleteInputChip
        options={allSubjects.map(subject => subject.value)}
        selectedOptions={book.subjects.map(subject => subject.value)}
        title="Subjects"
        name="subject"
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
