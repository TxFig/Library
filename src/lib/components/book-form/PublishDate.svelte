<script lang="ts">
    import type { FieldProxy, ValidationErrors, Infer } from "sveltekit-superforms";
    import NumberInput from "../form/NumberInput.svelte";
    import type { DateObject } from "$lib/validation/book/publish-date";
    import ErrorMessage from "../form/ErrorMessage.svelte";
    import type { BookCreateSchema } from "$lib/validation/book/book";

    export let proxy: FieldProxy<DateObject>
    export let errors: ValidationErrors<Infer<BookCreateSchema>["edition"]>["publishDate"] = undefined
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="label">
    <span>Publish Date</span>
    <ErrorMessage errors={errors} >
    <div class="flex gap-4 md:gap-8">
        <NumberInput text="Day" bind:value={$proxy.day} class="w-full" />
        <NumberInput text="Month" bind:value={$proxy.month} class="w-full" />
        <NumberInput text="Year" bind:value={$proxy.year} class="w-full" required />
    </div>
    </ErrorMessage>
</label>
