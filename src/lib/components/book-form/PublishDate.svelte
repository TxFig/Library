<script lang="ts">
    import type PublishDateSchema from "$lib/validation/publish-date";
    import type { z } from "zod";

    export let day: number | undefined = undefined
    export let month: number | undefined = undefined
    export let year: number | undefined = undefined

    type FormattedError = z.inferFormattedError<typeof PublishDateSchema>
    export let errors: FormattedError | undefined = undefined
</script>

<label class="label">
    <span>Publish Date</span>
    <div class="flex gap-8">
        <div class="w-full space-y-1">
            <p>Day</p>
            <input class="input" type="number" name="publish_date.day" value={day ?? ""}/>
        </div>
        <div class="w-full space-y-1">
            <p>Month</p>
            <input class="input" type="number" name="publish_date.month" value={month ?? ""}/>
        </div>
        <div class="w-full space-y-1">
            <p>Year</p>
            <input class="input" type="number" name="publish_date.year" value={year ?? ""}/>
        </div>
    </div>
    {#if errors?._errors && errors._errors.length != 0}
        <p class="text-red-600">{errors?._errors[0]}</p>
    {/if}
</label>
