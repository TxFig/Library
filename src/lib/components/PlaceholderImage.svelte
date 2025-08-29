<script lang="ts">
    import type { HTMLImgAttributes } from "svelte/elements";


    let props: HTMLImgAttributes = $props()
</script>

<img
    src="/placeholder.svg"
    alt=""
    loading="lazy"
    {...props}
/>
