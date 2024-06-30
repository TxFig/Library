<script lang="ts">
    import type { Infer, ValidationErrors } from "sveltekit-superforms";
    import NumberInput from "../NumberInput.svelte";
    import type { BookCreateSchema } from "$lib/validation/book/book-form";

    export let day: number | undefined | null = undefined
    export let month: number | undefined | null = undefined
    export let year: number | undefined | null = undefined

    type PublishDateError = ValidationErrors<Infer<BookCreateSchema>>["publish_date"]
    export let errors: PublishDateError | undefined = undefined

    $: console.log(errors)

</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="label">
    <span>Publish Date</span>
    <div class="flex gap-8">
        <NumberInput text="Day" bind:value={day} class="w-full" />
        <NumberInput text="Month" bind:value={month} class="w-full" />
        <NumberInput text="Year" bind:value={year} class="w-full" />
    </div>
    <!-- {#if errors?._errors && errors._errors.length != 0}
        <p class="text-red-600">{errors?._errors[0]}</p>
    {/if} -->
</label>
