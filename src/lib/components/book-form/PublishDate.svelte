<script lang="ts">
    import type { Infer, ValidationErrors } from "sveltekit-superforms";
    import NumberInput from "../NumberInput.svelte";
    import type { BookCreateSchema } from "$lib/validation/book/book-form";
    import type { DateObject } from "$lib/validation/book/publish-date";


    export let dateObject: DateObject = {}

    type PublishDateError = ValidationErrors<Infer<BookCreateSchema>>["publish_date"]
    export let errors: PublishDateError | undefined = undefined
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="label">
    <span>Publish Date</span>
    <div class="flex gap-8">
        <NumberInput text="Day" bind:value={dateObject.day} class="w-full" />
        <NumberInput text="Month" bind:value={dateObject.month} class="w-full" />
        <NumberInput text="Year" bind:value={dateObject.year} class="w-full" />
    </div>
    {#if errors?._errors && errors._errors.length != 0}
        <p class="text-red-600">{errors?._errors[0]}</p>
    {/if}
</label>
