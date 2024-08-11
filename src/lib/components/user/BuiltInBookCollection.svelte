<script lang="ts">
    import type { BuiltInBookCollectionWithEntireBooks } from "$lib/server/database/books/collection";
    import CollectionDisplay from "./CollectionDisplay.svelte";

    export let collection: BuiltInBookCollectionWithEntireBooks
</script>

<fieldset class="border border-surface-600 px-4 py-1 rounded-token">
    <legend class="px-1">{collection.name}</legend>
    <CollectionDisplay {collection} />
</fieldset>
