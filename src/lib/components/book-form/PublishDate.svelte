<script lang="ts">
    export let day: string | undefined = undefined
    export let month: string | undefined = undefined
    export let year: string | undefined = undefined
</script>

<label class="label">
    <span>Publish Date</span>
    <div class="flex gap-8">
        <div class="w-full space-y-1">
            <p>Day</p>
            <input class="input" type="number" name="publish_date:day" value={day ?? ""} min={1} max={31}/>
        </div>
        <div class="w-full space-y-1">
            <p>Month</p>
            <input class="input" type="number" name="publish_date:month" value={month ?? ""} min={1} max={12}/>
        </div>
        <div class="w-full space-y-1">
            <p>Year</p>
            <input class="input" type="number" name="publish_date:year" value={year ?? ""} min={1970} max={2023}/>
        </div>
    </div>
</label>
