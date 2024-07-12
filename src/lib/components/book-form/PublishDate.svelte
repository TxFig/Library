<script lang="ts">
    import type { Infer, ValidationErrors } from "sveltekit-superforms";
    import NumberInput from "../NumberInput.svelte";
    import type { BookCreateSchema } from "$lib/validation/book/book-form";
<<<<<<< HEAD
    import type { DateObject } from "$lib/validation/book/publish-date";
=======
>>>>>>> origin/refactor/api


<<<<<<< HEAD
    export let dateObject: DateObject = {}

    type PublishDateError = ValidationErrors<Infer<BookCreateSchema>>["publish_date"]
    export let errors: PublishDateError | undefined = undefined
=======
    type PublishDateError = ValidationErrors<Infer<BookCreateSchema>>["publish_date"]
    export let errors: PublishDateError | undefined = undefined

    $: console.log(errors)

>>>>>>> origin/refactor/api
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="label">
    <span>Publish Date</span>
    <div class="flex gap-8">
<<<<<<< HEAD
        <NumberInput text="Day" bind:value={dateObject.day} class="w-full" />
        <NumberInput text="Month" bind:value={dateObject.month} class="w-full" />
        <NumberInput text="Year" bind:value={dateObject.year} class="w-full" />
=======
        <NumberInput text="Day" bind:value={day} class="w-full" />
        <NumberInput text="Month" bind:value={month} class="w-full" />
        <NumberInput text="Year" bind:value={year} class="w-full" />
>>>>>>> origin/refactor/api
    </div>
    <!-- {#if errors?._errors && errors._errors.length != 0}
        <p class="text-red-600">{errors?._errors[0]}</p>
    {/if} -->
</label>
