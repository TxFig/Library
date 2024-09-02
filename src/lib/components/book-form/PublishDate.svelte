<script lang="ts">
    import type { Infer, ValidationErrors } from "sveltekit-superforms";
    import NumberInput from "../form/NumberInput.svelte";
    import type { BookCreateSchema } from "$lib/validation/book/book-form";
    import type { DateObject } from "$lib/validation/book/publish-date";


    export let dateObject: DateObject | undefined = undefined
    let data: DateObject = dateObject ?? {}
    $: dateObject = data

    type PublishDateError = ValidationErrors<Infer<BookCreateSchema>>["publish_date"]
    export let errors: PublishDateError | undefined = undefined
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="label">
    <span>Publish Date</span>
    <div class="flex gap-4 md:gap-8">
        <NumberInput text="Day" bind:value={data.day} class="w-full" />
        <NumberInput text="Month" bind:value={data.month} class="w-full" />
        <NumberInput text="Year" bind:value={data.year} class="w-full" />
    </div>
    {#if errors?._errors && errors._errors.length != 0}
        <p class="text-red-600">{errors?._errors[0]}</p>
    {/if}
</label>
