<script lang="ts">
    export let day: number | undefined = undefined
    export let month: number | undefined = undefined
    export let year: number | undefined = undefined

    const currentYear = new Date().getFullYear()
</script>

<label class="label">
    <span>Publish Date</span>
    <div class="flex gap-8">
        <div class="w-full space-y-1">
            <p>Day</p>
            <input class="input" type="number" name="publish_date.day" value={day ?? ""} min={1} max={31}/>
        </div>
        <div class="w-full space-y-1">
            <p>Month</p>
            <input class="input" type="number" name="publish_date.month" value={month ?? ""} min={1} max={12}/>
        </div>
        <div class="w-full space-y-1">
            <p>Year</p>
            <input class="input" type="number" name="publish_date.year" value={year ?? ""} min={1970} max={currentYear}/>
        </div>
    </div>
</label>
