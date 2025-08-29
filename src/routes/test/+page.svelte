<script lang="ts">
    import LocationInput from "$lib/components/book-form/location/LocationInput.svelte";

    let value = $state<string[]>([])
</script>

<div class="h-full flex items-center justify-center flex-col gap-8">
    <p>{value.join(", ")}</p>
    <LocationInput bind:value />
</div>

