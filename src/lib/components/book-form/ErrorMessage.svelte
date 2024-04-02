<script lang="ts">
    export let errors: { _errors: string[] } | undefined = undefined
    $: message = errors?._errors[0] ?? undefined
</script>

{#if message}
    <p class="text-red-600">{message}</p>
{/if}
