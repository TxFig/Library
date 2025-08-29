<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { Tree } from "./LocationInput.svelte";
    import LocalInputNode from "./LocationInputNode.svelte"
    import Input from "./Input.svelte";


    let {
        tree = $bindable(),
        onSelect,
        clearInputsCallbacks = $bindable(),
        clearInputs,
        parents
    }: {
        tree: Tree,
        onSelect: (values: string[]) => void,
        clearInputsCallbacks: (() => void)[],
        clearInputs: () => void,
        parents: string[]
    } = $props()

    let input = $state(false)
    let visible = $state(false)
    let inputValue = $state("")

    function clearInput() {
        input = false
    }
    clearInputsCallbacks.push(clearInput)
</script>

<div class="grid grid-cols-[auto_1fr_auto] group hover:variant-soft p-1 min-w-fit">
    <button
        type="button"
        class="btn-icon btn-icon-sm hover:variant-soft disabled:!cursor-default"
        onclick={() => visible = !visible}
        disabled={tree.children.length === 0}
    >
        {#if tree.children.length === 0}
            <Icon icon="mdi:minus" height="16" />
        {:else if visible}
            <Icon icon="mdi:chevron-up" height="16" />
        {:else}
            <Icon icon="mdi:chevron-down" height="16" />
        {/if}
    </button>
    <button
        type="button"
        class="btn btn-sm justify-start hover:variant-soft"
        onclick={() => {
            onSelect([...parents, tree.value])
        }}
        data-location
    >
        {tree.value}
    </button>
    <button
        type="button"
        class="btn-icon btn-icon-sm hover:variant-soft opacity-0 group-hover:opacity-100 focus:opacity-100"
        onclick={() => {
            clearInputs()
            input = true
        }}
    >
        <Icon icon="mdi:plus" height="16" />
    </button>
</div>
{#if input}
    <Input
        bind:value={inputValue}
        placeholder="Enter location name..."
        onAdd={(value) => {
            tree.children.unshift({
                value,
                children: []
            })
            input = false
            visible = true
        }}
        onCancel={() => input = false}
        validateInput={(value) => {
            const siblings = tree.children.map(child => child.value)
            return value !== tree.value && !parents.includes(value) && !siblings.includes(value)
        }}
    />
{/if}
<div class={[
    "pl-4 hidden",
    { "!block": visible }
]}>
    {#each tree.children as node, index}
        <LocalInputNode
            bind:tree={tree.children[index]}
            {onSelect}
            bind:clearInputsCallbacks
            {clearInputs}
            parents={[...parents, tree.value]}
        />
    {/each}
</div>
