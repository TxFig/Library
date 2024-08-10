<script lang="ts">
    import CollectionsModal from "$lib/components/book-page/CollectionsModal.svelte";
    import Icon from "@iconify/svelte";
    import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";


    export let isbn: string

    const modalStore = getModalStore()

    const addToCollectionPopup: ModalSettings = {
        type: "component",
        component: {
            ref: CollectionsModal,
            props: { isbn }
        }
    }

    function showPopupAddToCollection() {
        modalStore.trigger(addToCollectionPopup)
    }
</script>

<button class="btn variant-ringed-secondary rounded-lg space-x-0 sm:space-x-2" on:click={showPopupAddToCollection}>
    <span class="hidden sm:block">Collections</span>
    <Icon icon="material-symbols:collections-bookmark-outline" width="24" />
</button>
