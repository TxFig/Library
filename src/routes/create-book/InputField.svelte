<script lang="ts">
    import NumberInput from "$lib/components/NumberInput.svelte"

    export let text: string
    export let name: string
    export let type: "text" | "number" = "text"
    export let value: string | undefined = undefined
    export let required: boolean = false

</script>

<label class="label">
    <span>
        {text}
        {#if required}
            <sup class="text-red-500">*</sup>
        {/if}
    </span>
    {#if type == "text"}
        <input class="input" type="text" name={name} bind:value={value} />
    {:else}
        <NumberInput name={name} value={value} />
    {/if}
</label>
