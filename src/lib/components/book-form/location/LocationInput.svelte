<script lang="ts">
    import Icon from "@iconify/svelte"
    import { popup, type PopupSettings } from "@skeletonlabs/skeleton"
    import Input from "./Input.svelte";
    import LocationInputNode from "./LocationInputNode.svelte";


    let { value = $bindable([]) }: {
        value: string[]
    } = $props()

    let popupOpen = $state(false)
    const popupSettings: PopupSettings = {
        event: "click",
        target: "location-input",
        placement: "bottom",
        closeQuery: "button[data-location]",
        state({ state }) {
            popupOpen = state
        }
    }
    let clientWidth = $state(0)

    let input = $state(false)
    let inputValue = $state("")

    let tree = $state<Tree[]>([])
    let clearInputsCallbacks = $state<(() => void)[]>([])

    function clearInputs() {
        input = false
        for (const fn of clearInputsCallbacks) {
            fn()
        }
    }
</script>

<script module lang="ts">
    export type Tree = {
        value: string,
        children: Tree[],
    }

</script>

<button
    type="button"
    class="btn variant-outline flex items-center justify-between w-80"
    use:popup={popupSettings}
    bind:clientWidth={clientWidth}
>
    <div class="flex items-center gap-2">
        <Icon icon="mdi:location" height="16" class="mb-px shrink-0" />
        {#if value.length !== 0}
            <ol class="breadcrumb space-x-2 flex-wrap text-sm">
                {#each value as crumb, i}
                    {#if i < value.length - 1}
                        <li class="crumb">{crumb}</li>
                        <li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
                    {:else}
                        <li class="crumb">{crumb}</li>
                    {/if}
                {/each}
            </ol>
        {:else}
            <p class="opacity-70 text-sm">Select or create a location</p>
        {/if}
    </div>
    {#if popupOpen}
        <Icon icon="mdi:chevron-up" height="16" />
    {:else}
        <Icon icon="mdi:chevron-down" height="16" />
    {/if}
</button>
<div
    data-popup="location-input"
    class="card p-4 shadow-xl max-h-80 overflow-auto"
    style:width="{clientWidth}px"
>
    <div class="arrow bg-surface-100-800-token border-t border-l border-surface-600"></div>
    <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center">
            <p>Select Location</p>
            <button
                type="button"
                class="btn btn-sm hover:variant-soft"
                onclick={() => {
                    clearInputs()
                    input = true
                }}
            >
                <Icon icon="mdi:plus" height="16" />
                <span>Add Base</span>
            </button>
        </div>

        {#if input}
            <Input
                bind:value={inputValue}
                placeholder="Enter base location..."
                onAdd={(value) => {
                    tree.unshift({
                        value,
                        children: []
                    })
                    input = false
                }}
                onCancel={() => input = false}
                validateInput={(value) => {
                    const siblings = tree.map(node => node.value)
                    return !siblings.includes(value)
                }}
            />
        {/if}

        <div>
            {#each tree as _, index}
                <LocationInputNode
                    bind:tree={tree[index]}
                    onSelect={(values) => value = values}
                    bind:clearInputsCallbacks
                    {clearInputs}
                    parents={[]}
                />
            {/each}
        </div>
    </div>
</div>
