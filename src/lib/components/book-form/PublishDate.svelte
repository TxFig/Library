<script lang="ts">
    import ErrorMessage from "../form/ErrorMessage.svelte"
    import { minYear, type PublishDateSchemaInput } from "$lib/validation/book/publish-date"
    import Combobox from "../form/Combobox.svelte"
    import months from "$lib/utils/months"


    let {
        year = $bindable(),
        month = $bindable(),
        day = $bindable(),
        errors,
        yearErrors,
    }: {
        year: PublishDateSchemaInput["year"],
        month?: PublishDateSchemaInput["month"],
        day?: PublishDateSchemaInput["day"],
        errors?: string[],
        yearErrors?: string[],
    } = $props()

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: currentYear - minYear + 1 }, (_, i) => currentYear - i)
    const days = Array.from({ length: 31 }, (_, i) => i + 1)
    let monthSelected = $state(month ? months[month] : undefined)
    $effect(() => {
        if (!monthSelected) return
        month = months.indexOf(monthSelected)
    })
</script>

<div class="space-y-2">
    <h3 class="h3">Publish Date</h3>

    <ErrorMessage errors={yearErrors ? undefined : errors}>
        <div class="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8">
            <ErrorMessage errors={yearErrors}>
                <Combobox name="year" options={years} placeholder="Year" bind:value={year} required width="w-full"/>
            </ErrorMessage>
            <Combobox name="month" options={months} placeholder="Month" bind:value={monthSelected} width="w-full"/>
            <Combobox name="day" options={days} placeholder="Day" bind:value={day} width="w-full"/>
        </div>
    </ErrorMessage>
</div>
