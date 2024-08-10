<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { getModalStore } from '@skeletonlabs/skeleton'

	export let parent: SvelteComponent;
    export let data: string;

	const modalStore = getModalStore();

</script>


{#if $modalStore[0]}
	<div class="card p-4 max-w-[100%] sm:max-w-[80%] w-modal shadow-xl space-y-4">
		<header class="text-2xl font-bold">{$modalStore[0].title}</header>
        <pre class="text-wrap overflow-y-auto max-h-[80vh]">{data}</pre>

		<footer class="modal-footer {parent.regionFooter}">
            <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        </footer>
	</div>
{/if}
