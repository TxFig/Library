<script lang="ts">
    import Icon from "@iconify/svelte";
    import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import ImageInputModal from "./ImageInputModal.svelte";
    import { invalidateAll } from "$app/navigation";


    export let isbn: string

    const modalStore = getModalStore()
    const addImageModal: ModalSettings = {
        type: "component",
        component: {
            ref: ImageInputModal,
        },
        response(file?: File) {
            if (!file) return
            sendUpdateRequest(file)
        }
    }

    async function sendUpdateRequest(file: File) {
        const formData = new FormData()
        formData.append("image", file)
        const response = await fetch(`/api/book/image/${isbn}`, {
            method: "PATCH",
            body: formData
        })
        await invalidateAll()
    }
</script>

<div
    class="flex flex-col items-center justify-center gap-2 p-12 relative"
    style="
        background:
            linear-gradient(to right, #fbe7d1 20%, transparent 20%, transparent 80%, #fbe7d1 80%) top,
            linear-gradient(to right, #fbe7d1 20%, transparent 20%, transparent 80%, #fbe7d1 80%) bottom,
            linear-gradient(to bottom, #fbe7d1 20%, transparent 20%, transparent 80%, #fbe7d1 80%, #fbe7d1 99%, transparent 99%, transparent) left,
            linear-gradient(to bottom, #fbe7d1 20%, transparent 20%, transparent 80%, #fbe7d1 80%, #fbe7d1 99%, transparent 99%, transparent) right;
        background-size: 100% 4px, 100% 4px, 4px 100%, 4px 100%;
        background-repeat: no-repeat;
    "
>
    <Icon icon="carbon:no-image" color="#fbe7d1" width="128" class="mb-1"/>
    <p>No Cover<br>Available</p>
    <button
        class="btn-icon btn-icon-sm variant-filled-primary absolute bottom-4 right-4"
        on:click={() => modalStore.trigger(addImageModal)}
    >
        <Icon icon="mdi:plus" width="16" height="16" />
    </button>
</div>
