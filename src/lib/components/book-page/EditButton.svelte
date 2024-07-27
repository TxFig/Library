<script lang="ts">
    import { goto } from "$app/navigation";
    import Icon from "@iconify/svelte";

    export let isbn: string
    function redirectToEditPage() {
        goto(`/book/edit/${isbn}`)
    }

</script>

<button class="btn variant-ringed-primary rounded-lg space-x-0 sm:space-x-2" on:click={redirectToEditPage}>
    <span class="hidden sm:block">Edit</span>
    <Icon icon="material-symbols:edit" width="24" />
</button>
