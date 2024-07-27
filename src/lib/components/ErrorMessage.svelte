<script lang="ts">
    export let errors: string[] | undefined = undefined
    $: message = errors?.[0] ?? undefined
</script>

{#if message}
    <p class="text-red-600">{message}</p>
{/if}
