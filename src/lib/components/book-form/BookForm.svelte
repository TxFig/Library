<script lang="ts">
    import SuperDebug, { superForm, type Infer, type InferIn, type SuperValidated } from "sveltekit-superforms";
    import ErrorMessage from "./ErrorMessage.svelte";
    import { BookCreateSchema } from "$lib/validation/book/book-form"
    import NumberInput from "../NumberInput.svelte";
    import TextInput from "../TextInput.svelte";
    import PublishDate from "./PublishDate.svelte";
    import ImageInput from "./ImageInput.svelte";


    export let data: SuperValidated<
        Infer<BookCreateSchema>,
        App.Superforms.Message,
        InferIn<BookCreateSchema>
    >

    const { form, errors, enhance } = superForm(data, {
        dataType: "json",

        onUpdated({ form }) {
            if (form.message) {
                alert(form.message.text)
            }
        }
    })

    const ISBNRegex = /^[0-9X]*$/
</script>


<SuperDebug data={$form} />

<form
    method="post"
    enctype="multipart/form-data"
    use:enhance
    class="space-y-6"
>
    <div>
        <TextInput text="ISBN" name="isbn"  bind:value={$form.isbn} required allowedRegex={ISBNRegex} />
        <ErrorMessage errors={$errors.isbn}/>
    </div>
    <div>
        <TextInput text="Title" name="title" bind:value={$form.title} required />
        <ErrorMessage errors={$errors.title}/>
    </div>
    <div>
        <TextInput text="Subtitle" name="subtitle" bind:value={$form.subtitle} />
        <ErrorMessage errors={$errors.subtitle}/>
    </div>
    <div>
        <NumberInput text="Number of Pages" name="number_of_pages" bind:value={$form.number_of_pages} />
        <ErrorMessage errors={$errors.number_of_pages}/>
    </div>

    <PublishDate bind:dateObject={$form.publish_date} bind:errors={$errors.publish_date} />

    <div class="flex gap-6">
        <ImageInput title="Front Image" name="front_image" bind:file={$form.front_image} />
        <ImageInput title="Back Image" name="back_image" bind:file={$form.back_image} />
    </div>

    <div class="flex justify-center !mt-16">
        <button type="submit" class="btn bg-primary-500 px-10 py-3">Submit</button>
    </div>
</form>
