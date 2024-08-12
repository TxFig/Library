<script lang="ts">
    import type { BuiltInBookCollectionWithEntireBooks } from "$lib/server/database/books/collection";
    import Icon from "@iconify/svelte";
    import CollectionDisplay from "./CollectionDisplay.svelte";

    const icons: Record<string, string> = {
        "Books Reading": "fa6-regular:bookmark",
        "Books Read": "fa6-regular:circle-check",
        "Want to Read": "material-symbols:star-outline"
    }

    export let collection: BuiltInBookCollectionWithEntireBooks
</script>

<fieldset class="border border-surface-600 px-4 py-1 rounded-token">
    <legend class="px-1 flex items-center gap-1">
        <Icon icon={icons[collection.name]} width="16" height="16" />
        <span>{collection.name}</span>
    </legend>
    <CollectionDisplay {collection} />
</fieldset>
