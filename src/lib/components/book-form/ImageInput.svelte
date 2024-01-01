<script lang="ts">
    import { MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB } from "$lib/utils/book-form";
    import Icon from "@iconify/svelte"
    import { FileDropzone, getToastStore } from "@skeletonlabs/skeleton"


    const toastStore = getToastStore()

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
        const image = files[0]
        const url = await getDataURLImage(image)
        src = url ?? ""
    }

    export let src: string = ""
    let files: FileList

    export let title: string
    export let name: string
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
    {#if src}
        <img src={src} alt={title} class="w-full">
    {/if}
</div>
