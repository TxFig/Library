<script lang="ts">
    import AddToCollectionModal from "$lib/components/book-page/AddToCollectionModal.svelte";
    import Icon from "@iconify/svelte";
    import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";


    export let isbn: string

    const modalStore = getModalStore()

    const addToCollectionPopup: ModalSettings = {
        type: "component",
        component: {
            ref: AddToCollectionModal,
            props: { isbn }
        }
    }

    function showPopupAddToCollection() {
        modalStore.trigger(addToCollectionPopup)
    }
</script>

<button class="btn variant-ringed-secondary rounded-lg space-x-0 sm:space-x-2" on:click={showPopupAddToCollection}>
    <span class="hidden sm:block">Add to Collection</span>
    <Icon icon="material-symbols:library-add-outline" width="24" />
</button>
