<script lang="ts">
    import Label from "./Label.svelte";
    import Input from "./Input.svelte";
    import type { ComponentProps } from "svelte";


    let {
        text,
        required = false,
        value = $bindable(undefined),
        ...rest
    }: {
        text: string,
        required?: boolean,
    } & ComponentProps<typeof Input> = $props()
</script>


<Label {text} {required}>
    <Input bind:value {...rest} />
</Label>
