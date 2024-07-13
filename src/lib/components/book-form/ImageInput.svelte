<script lang="ts">
    import { MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB } from "$lib/validation/book/file";
    import Icon from "@iconify/svelte"
    import { FileDropzone, getToastStore } from "@skeletonlabs/skeleton"
    import TextInput from "../TextInput.svelte";
    import fetchImageAsFile from "$lib/utils/fetch-image-as-file";


    const toastStore = getToastStore()
    let srcError: boolean = false

    async function getDataURLImage(image: File): Promise<string | null> {
        if (!image) return null
        if (image.size > MAX_IMAGE_SIZE_BYTES) {
            toastStore.trigger({
                message: `Image size can not exceeded ${MAX_IMAGE_SIZE_MB} MB`,
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

    async function onImageChange() {
        file = files[0]
        const url = await getDataURLImage(file)
        src = url ?? ""
        srcError = false
    }

    export let src: string = ""
    let files: FileList
    export let file: File | undefined = undefined

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
                file = await fetchImageAsFile(imageUrl)
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


<div class="flex flex-col space-y-2 w-full">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="label">{title}</label>
    <FileDropzone name={name} accept="image/*" on:change={onImageChange} bind:files={files}>
        <svelte:fragment slot="lead">
            <div class="flex justify-center">
                <Icon icon="uil:image-upload" color="white" width="32" height="32" />
            </div>
        </svelte:fragment>
    </FileDropzone>
    <TextInput text="Image URL" bind:value={imageUrl} on:input={handleImageUrlInput} />
    {#if src}
        <img src={src} alt={title} class="w-full" on:error={handleImageError} />
    {/if}
    {#if srcError}
        <p class="text-red-600">Invalid Image</p>
    {/if}
    <p></p>
</div>
