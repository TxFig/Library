<script lang="ts">
    import HttpCodes from "$lib/utils/http-codes";
    import Icon from "@iconify/svelte";
    import { getModalStore, getToastStore, type ModalSettings } from "@skeletonlabs/skeleton";

    export let isbn: string


    const modalStore = getModalStore()
    const toastStore = getToastStore()

    async function deleteBook() {
        try {
            const response = await fetch(`/api/book/${isbn}`, { method: "DELETE" })

            if (!(response.status == HttpCodes.Success)) {
                toastStore.trigger({
                    message: "Error Deleting Book",
                    background: "variant-filled-error"
                })
                return
            }

            toastStore.trigger({
                message: "Book Successfully Deleted",
                background: "variant-filled-success"
            })
            window.location.href = "/"
        } catch (err) {
            toastStore.trigger({
                message: "Error Deleting Book",
                background: "variant-filled-error"
            })
        }
    }

    const deletePopup: ModalSettings = {
        title: "Delete Confirmation",
        type: "confirm",
        response(confirm) {
            if (confirm) {
                deleteBook()
            }
        },

    }

    async function showPopupDeleteBook() {
        modalStore.trigger(deletePopup)
    }

</script>

<button class="btn variant-ringed-error rounded-lg space-x-0 sm:space-x-2" on:click={showPopupDeleteBook}>
    <span class="hidden sm:block">Delete</span>
    <Icon icon="ic:baseline-delete" width="24" />
</button>
