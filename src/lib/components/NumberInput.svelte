<script lang="ts">
    export let name: string
    export let value: string | undefined = undefined
    export let min: number | undefined = undefined
    export let max: number | undefined = undefined


    const onlyDigitsRegex = /^\d*$/
    const nonDigitsRegex = /\D/g
    function handleInput() {
        if (!value || onlyDigitsRegex.test(value)) return

        value = value.replace(nonDigitsRegex, "")
    }

</script>

<input
    class="input"
    type="text"
    {name} {min} {max}
    bind:value
    on:input={handleInput}
/>
