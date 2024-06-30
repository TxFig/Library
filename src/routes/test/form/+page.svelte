<script lang="ts">
    import SuperDebug, { arrayProxy, superForm } from "sveltekit-superforms";
    import type { PageData } from "./$types";
    import AutocompleteInputChip from "$lib/components/book-form/AutocompleteInputChip.svelte";

    export let data: PageData;

    const superform = superForm(data.form, {
        onUpdated({ form }) {
            if (form.message) {
                alert(form.message.text)
            }
        }
    });

    const { form, errors, enhance } = superform

    const options = ["a", "b", "c", "d", "e"]

</script>

<SuperDebug data={$form} />
<form method="post" class="flex flex-col gap-4" use:enhance>
    <label for="name">Name</label>
    <input type="text" name="name" bind:value={$form.name} class="input"/>
    {#if $errors.name}<p class="text-red-500">{$errors.name}</p>{/if}

    <label for="email">E-mail</label>
    <input type="email" name="email" bind:value={$form.email} class="input"/>
    {#if $errors.email}<p class="text-red-500">{$errors.email}</p>{/if}

    <label for="number">Number</label>
    <input type="number" name="number" bind:value={$form.number} class="input"/>
    {#if $errors.number}<p class="text-red-500">{$errors.number}</p>{/if}

    <AutocompleteInputChip
        options={options}
        title="Array Test"
        name="array"
        placeholder="Enter option..."
        bind:selectedOptions={$form.array}
    />

    <button class="btn variant-filled-primary" type="submit">Submit</button>
</form>
