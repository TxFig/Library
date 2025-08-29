<script lang="ts">
    import Icon from "@iconify/svelte"
    import { FileDropzone, getToastStore } from "@skeletonlabs/skeleton"
    import * as valibot from "valibot"
    import TextInputField from "../form/TextInputField.svelte";
    import fetchURLAsFile from "$lib/utils/fetch-url-as-file";
    import { ImageFileSchema, UrlSchema, ACCEPTED_IMAGE_TYPES } from "$lib/validation/book/file";


    const toastStore = getToastStore()

    let {
        file = $bindable(),
        name,
        url: URLInput = $bindable(""),
        hasError = $bindable(false)
    }: {
        file?: File,
        name: string,
        url: string,
        hasError: boolean
    } = $props()

    let dataURL: string = $state("")
    let files: FileList | undefined = $state()
    let fileInputElement: HTMLInputElement | undefined = $state()

    async function getDataURL(image: File): Promise<string | null> {
        const parseResult = valibot.safeParse(ImageFileSchema, image)

        if (!parseResult.success) {
            toastStore.trigger({
                message: parseResult.issues[0].message,
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

    $effect(() => {
        if (!file) {
            dataURL = ""
            return
        }

        getDataURL(file)
            .then(url => {
                dataURL = url ?? ""
                hasError = false
            })
            .catch(() => {
                hasError = true
            })
    })

    async function onImageUrlInput() {
        if (!URLInput) {
            hasError = false
            return
        }

        const parseResult = valibot.safeParse(UrlSchema, URLInput)
        if (!parseResult.success) {
            hasError = true
            return
        }

        let newFile = await fetchURLAsFile(URLInput)
        if (newFile) {
            file = newFile
        }
        hasError = !newFile
    }

    function onImageErrorEvent() {
        dataURL = ""
        hasError = true
    }

    // https://stackoverflow.com/a/12102992
    function onInputClick() {
        fileInputElement!.value = ""
    }

    function onInputChange() {
        file = files?.[0]
        URLInput = ""
    }
</script>

<div class="flex flex-col md:flex-row gap-4 w-full">
    <div class="flex flex-col gap-2 md:w-4/5">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <FileDropzone
            name={name}
            accept={ACCEPTED_IMAGE_TYPES.join(", ")}
            bind:fileInput={fileInputElement}
            bind:files={files}
            on:change={onInputChange}
            on:click={onInputClick}
            regionInterfaceText="flex items-center gap-2"
            slotLead=""
        >
            <svelte:fragment slot="lead">
                <div class="flex justify-center">
                    <Icon icon="uil:image-upload" color="white" width="32" height="32" />
                </div>
            </svelte:fragment>
        </FileDropzone>
        <TextInputField text="Image URL" bind:value={URLInput} oninput={onImageUrlInput} />
        {#if hasError}
            <p class="text-red-600">Error loading image</p>
        {/if}
    </div>

    <div class="flex items-center justify-center border-2 border-surface-500 w-full md:w-1/5">
        {#if dataURL}
            <img src={dataURL} alt="Book Cover" class="h-full object-contain" onerror={onImageErrorEvent} />
        {:else}
            <p class="py-6">No Image</p>
        {/if}
    </div>
</div>
