<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { HTMLInputAttributes } from "svelte/elements"


    let {
        value = $bindable(""),
        onAdd, onCancel, validateInput: validInput,
        ...rest
    }: {
        value: string,
        onAdd?: (value: string) => void,
        onCancel?: () => void,
        validateInput?: (value: string) => boolean
    } & HTMLInputAttributes = $props()

    let invalidInput = $state(false)

    function onAddWrapper() {
        if (value === "") return
        if (validInput && !validInput(value)) return
        onAdd?.(value)
        value = ""
    }
</script>

<div class="grid grid-cols-[1fr_auto] input-group min-w-48">
    <input
        type="text"
        class={[
            "input text-xs",
            { "!bg-error-800 !text-error-100": invalidInput }
        ]}
        bind:value={value}
        oninput={() => validInput && (invalidInput = !validInput(value))}
        onkeydown={(event) => event.key === "Enter" && onAddWrapper()}
        {...rest}
    />
    <div class="input-group-shim w-fit !px-1 *:!px-2">
        <button
            class="btn-icon btn-icon-sm w-fit text-success-500"
            title="Add"
            onclick={() => onAddWrapper()}
        >
            <Icon icon="mdi:check" height="16" />
        </button>
        <button
            class="btn-icon btn-icon-sm w-fit text-error-500"
            title="Cancel"
            onclick={() => {
                value = ""
                onCancel?.()
            }}
        >
            <Icon icon="mdi:close" height="16" />
        </button>
    </div>
</div>
