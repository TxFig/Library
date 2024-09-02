<script lang="ts">
    import Icon from "@iconify/svelte"
    import { FileDropzone, getToastStore } from "@skeletonlabs/skeleton"
    import TextInput from "../form/TextInput.svelte";
    import fetchImageAsFile from "$lib/utils/fetch-image-as-file";
    import FileSchema from "$lib/validation/book/file";


    const toastStore = getToastStore()
    let srcError: boolean = false

    async function getDataURLImage(image: File): Promise<string | null> {
        if (!image) return null
        const parsedFile = FileSchema.safeParse(image)
        if (!parsedFile.success) {
            toastStore.trigger({
                message: parsedFile.error.errors[0].message,
                background: "variant-filled-error"
            })
            return null
        }

        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(image)
        })
    }

    async function onImageChange(file: File) {
        const url = await getDataURLImage(file)
        src = url ?? ""
        srcError = false
    }

    export let src: string = ""
    let files: FileList
    export let file: File | undefined = undefined

    $: file && onImageChange(file)

    export let title: string
    export let name: string

    export let imageUrl: string = ""
    async function handleImageUrlInput() {
        if (!imageUrl) return
        try {
            const url = new URL(imageUrl)
            if (url.protocol === "http:" || url.protocol === "https:") {
                src = imageUrl
                srcError = false
                file = await fetchImageAsFile(imageUrl, "image/webp") ?? undefined
            }
        } catch (e) {
            srcError = true
        }
    }

    function handleImageError() {
        src = ""
        srcError = true
    }
</script>


<div class="flex flex-col md:flex-row gap-8 w-full">
    <div class="flex flex-col gap-2 md:w-4/5">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label">{title}</label>
        <FileDropzone name={name} accept="image/*" bind:files={files} on:change={() => file = files[0]}>
            <svelte:fragment slot="lead">
                <div class="flex justify-center">
                    <Icon icon="uil:image-upload" color="white" width="32" height="32" />
                </div>
            </svelte:fragment>
        </FileDropzone>
        <TextInput text="Image URL" bind:value={imageUrl} on:input={handleImageUrlInput} />
        {#if srcError}
            <p class="text-red-600">Invalid Image</p>
        {/if}
    </div>
    <div class="flex items-center justify-center w-full md:w-1/5">
        {#if src}
            <img src={src} alt={title} class="h-full object-contain" on:error={handleImageError} />
        {/if}
    </div>
</div>
