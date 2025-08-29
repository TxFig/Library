<script lang="ts">
    import filterRegex from "$lib/utils/filter-regex";
    import Label from "./Label.svelte";
    import Input from "./Input.svelte";
    import type { ComponentProps } from "svelte";


    let {
        text,
        required = false,
        value = $bindable(undefined),
        allowedRegex = /^[0-9]*$/,
        ...rest
    }: {
        text: string,
        required?: boolean,
    } & ComponentProps<typeof Input> = $props()

    function handleInput() {
        if (!value) return

        const validValue = filterRegex(allowedRegex, value.toString())
        if (validValue !== "")
            value = Number(validValue)
        else
            value = undefined
    }
</script>


<Label {text} {required}>
    <Input
        bind:value
        type="number"
        {handleInput}
        {...rest}
    />
</Label>
