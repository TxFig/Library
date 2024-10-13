<script lang="ts">
    import Icon from "@iconify/svelte";
    import EditableCombobox from "./EditableCombobox.svelte";

    export let text: string
    export let name: string
    export let required: boolean = false
    export let options: string[]
    export let value: string | undefined = undefined
    export let optionsWidth: string = "w-full"
    export let icon: string | undefined = undefined
    let externalClasses: string = ""
    export { externalClasses as class }
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="label {externalClasses}">
    <p class="flex items-center gap-1">
        <span>{text}</span>
        {#if icon}
            <Icon icon={icon} width="16" />
        {/if}
        {#if required}
            <sup class="text-red-500">*</sup>
        {/if}
    </p>
    <EditableCombobox
        name={name}
        options={options}
        bind:value={value}
        width={optionsWidth}
    />
</label>
