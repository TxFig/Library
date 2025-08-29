<script lang="ts">
	import type { SchemaToSuperValidated } from "$lib/validation/utils"
	import type { BookCopySchemaInput, BookEditionSchemaInput, FormBookSchema } from "$lib/validation/book"
	import { superForm } from "sveltekit-superforms"
	import { derived, writable } from "svelte/store"

    import type { AuthorTransformed } from "$lib/server/database/books/author"
    import type { SubjectTransformed } from "$lib/server/database/books/subject"
    import type { LanguageTransformed } from "$lib/server/database/books/language"
    import type { PublisherTransformed } from "$lib/server/database/books/publisher"
    import type { UserTransformed } from "$lib/server/database/auth/user"

	import { getModalStore, Tab, TabGroup, type ModalSettings } from "@skeletonlabs/skeleton"
	import ErrorMessage from "$lib/components/form/ErrorMessage.svelte"
	import AutocompleteInputChip from "./AutocompleteInputChip.svelte"
	import Icon from "@iconify/svelte"
	import TextInputField from "../form/TextInputField.svelte"
	import SearchableCombobox from "../form/SearchableCombobox.svelte"
	import PublishDate from "./PublishDate.svelte"
	import ImageInput from "./ImageInput.svelte"
	import { formatISBN, formISBNRegex, validateISBN } from "$lib/validation/book/isbn"
	import NumberInputField from "../form/NumberInputField.svelte"
    import Input from "../form/Input.svelte"
    import UserSelector from "./UserSelector.svelte"
    import Label from "../form/Label.svelte"
    import { page } from "$app/state"


	const {
        form,
        allAuthors,
        allSubjects,
        allLanguages,
        allPublishers,
        users
    }: {
		form: SchemaToSuperValidated<FormBookSchema>
		allAuthors: AuthorTransformed[]
		allSubjects: SubjectTransformed[]
		allLanguages: LanguageTransformed[]
		allPublishers: PublisherTransformed[],
        users: UserTransformed[]
	} = $props()

	const { form: data, errors, enhance, tainted } = superForm(form, {
		dataType: "json",
		stickyNavbar: ".app-bar",
		scrollToError: {
			behavior: "smooth",
			block: "center",
		},
        taintedMessage: true
	})

    $effect(() => {
        if (
            $tainted && $tainted.editions && $data.editions.length === 1 &&
            JSON.stringify(emptyEdition) === JSON.stringify($data.editions[0])
        ) {
            $tainted = undefined
        }
    })

	const emptyEdition = {
		title: "",
		language: "",
		authors: [],
		publishers: [],
		publishDate: { year: 0 },
		copies: [],
	} satisfies BookEditionSchemaInput

    type ImageInputState = { url: string, hasError: boolean }
    const imageStates = writable<ImageInputState[]>([])
    data.subscribe(($data) => {
        imageStates.update((states) => {
            return $data.editions.map((_, index) =>
                states[index] ?? { url: "", hasError: false }
            )
        })
    })

	const modalStore = getModalStore()

	let tabSet: number = $state(0)
	if ($data.editions.length === 0) {
        createTab()

        const isbn = page.url.searchParams.get("isbn")
        if (isbn && validateISBN(isbn)) {
            const formattedISBN = formatISBN(isbn)
            if (formattedISBN.length === 10)
                $data.editions[$data.editions.length - 1].isbn10 = formattedISBN
            else
                $data.editions[$data.editions.length - 1].isbn13 = formattedISBN
        }
    }

	function createTab() {
		$data.editions.push(structuredClone(emptyEdition))
		$data.editions = $data.editions
        tabSet = $data.editions.length - 1
	}

    const deleteConfirmationModalSettings: (onResult: () => void) => ModalSettings = (onResult) => ({
		type: "confirm",
		title: "Delete Confirmation",
		body: "Are you sure you wish to proceed?",
		response: (result: boolean) => {
			if (result) {
				onResult()
			}
		},
	})

	function onDeleteTab(index: number) {
		if (
			JSON.stringify(emptyEdition) !==
			JSON.stringify($data.editions[index])
		) {
            modalStore.trigger(
                deleteConfirmationModalSettings(() => removeTab(index))
            )
		} else {
			removeTab(index)
		}
	}

	function removeTab(index: number) {
		$data.editions.splice(index, 1)
		$data.editions = $data.editions

		if (tabSet >= $data.editions.length) {
			tabSet = $data.editions.length - 1
		}
		tabSet = Math.max(tabSet, $data.editions.length - 1)

        for (const key in $errors.editions) {
            const i = Number(key)
            if (i === index) {
                delete $errors.editions[i]
            }
            else if (i > index) {
                $errors.editions[i - 1] = $errors.editions[i]
                delete $errors.editions[i]
            }
            // If i < index, do nothing
        }
        $errors.editions = $errors.editions
	}

    const emptyCopy = {
        location: "",
        ownerId: ""
    } satisfies BookCopySchemaInput
    function createCopy() {
        $data.editions[tabSet].copies.push(structuredClone(emptyCopy))
        $data.editions[tabSet].copies = $data.editions[tabSet].copies
    }

    function onDeleteCopy(index: number) {
        if (
			JSON.stringify(emptyCopy) !==
			JSON.stringify($data.editions[tabSet].copies[index])
		) {
            modalStore.trigger(
                deleteConfirmationModalSettings(() => removeCopy(index))
            )
		} else {
			removeCopy(index)
		}
    }

    function removeCopy(index: number) {
		$data.editions[tabSet].copies.splice(index, 1)
		$data.editions[tabSet].copies = $data.editions[tabSet].copies
    }

    function isFullyEmpty(object: Record<PropertyKey, any>): boolean {
        if (object === undefined || object === null) return true

        if (typeof object !== "object") return false

        if (Array.isArray(object)) {
            if (object.length === 0) return true
            return object.every(item => isFullyEmpty(item))
        }

        const keys = Object.keys(object)
        if (keys.length === 0) return true

        for (const key of keys) {
            if (!isFullyEmpty(object[key])) {
                return false
            }
        }

        return true
    }

    const editionsError = derived(errors, ($errors) => {
        if (!$errors.editions) return

        return Object.fromEntries(
            Object.entries($errors.editions).map(([index, object]) => [
                index, !isFullyEmpty(object)
            ])
        )
    })
</script>

<form
	method="post"
	enctype="multipart/form-data"
	class="space-y-6 !mb-24"
	use:enhance
>
    <div class="rounded-container-token border shadow-sm border-primary-500/20">
        <div class="flex flex-col space-y-1.5 p-6 bg-primary-500/5">
            <h3 class="text-2xl font-semibold leading-none tracking-tight">Book Information</h3>
            <p class="text-sm">Enter the basic information about the book.</p>
        </div>
        <div class="flex flex-col md:flex-row *:w-full p-6 gap-4 md:gap-8">
            <ErrorMessage errors={$errors.authors}>
                <AutocompleteInputChip
                    options={allAuthors}
                    title="Authors"
                    name="authors"
                    placeholder="Search or add authors..."
                    bind:selectedOptions={$data.authors}
                    required
                />
            </ErrorMessage>
            <ErrorMessage errors={$errors.subjects}>
                <AutocompleteInputChip
                    options={allSubjects}
                    title="Subjects"
                    name="subjects"
                    placeholder="Search or add subjects..."
                    bind:selectedOptions={$data.subjects}
                />
            </ErrorMessage>
        </div>
    </div>

    <div class="rounded-container-token border shadow-sm border-primary-500/20">
        <div class="flex flex-col space-y-1.5 p-6 bg-primary-500/5">
            <h3 class="text-2xl font-semibold leading-none tracking-tight">Editions</h3>
            <p class="text-sm">Add one or more editions to this book.</p>
        </div>
        <TabGroup class="!space-y-0 p-2">
            {#each $data.editions as edition, index}
                <Tab
                    bind:group={tabSet}
                    name="tab-{index}"
                    value={index}
                    class={$editionsError?.[index] && "text-error-600"}
                >
                    <div class="flex gap-2 items-center">
                        {#if edition.title}
                            <span>{edition.title}</span>
                        {:else if $data.editions.length === 1}
                            <span>Untitled</span>
                        {:else}
                            <span>Untitled {index + 1}</span>
                        {/if}
                        {#if $data.editions.length > 1 && index === tabSet}
                            <button
                                class="bg-error-hover-token rounded-token p-0.5 text-primary-100"
                                type="button"
                                onclick={() => onDeleteTab(index)}
                            >
                                <Icon icon="tabler:x" width="20" height="20" />
                            </button>
                        {/if}
                    </div>
                </Tab>
            {/each}
            <button
                class="btn bg-primary-hover-token"
                type="button"
                onclick={createTab}
            >
                <Icon icon="tabler:plus" width="20" height="20" />
            </button>

            <svelte:fragment slot="panel">
                <div class="space-y-10 p-4">
                    <div class="space-y-4">
                        <ErrorMessage errors={$errors.editions?.[tabSet]?.title}>
                            <TextInputField
                                text="Title"
                                name="title"
                                required
                                bind:value={$data.editions[tabSet].title}
                            />
                        </ErrorMessage>
                        <ErrorMessage errors={$errors.editions?.[tabSet]?.subtitle}>
                            <TextInputField
                                text="Subtitle"
                                name="subtitle"
                                bind:value={$data.editions[tabSet].subtitle}
                            />
                        </ErrorMessage>
                        <div class="flex flex-col md:flex-row gap-4 md:gap-8 *:w-full md:*:w-1/2">
                            <ErrorMessage errors={$errors.editions?.[tabSet]?.pageCount}>
                                <NumberInputField
                                    text="Page Count"
                                    name="pageCount"
                                    bind:value={$data.editions[tabSet].pageCount}
                                    min={0}
                                />
                            </ErrorMessage>
                            <ErrorMessage errors={$errors.editions?.[tabSet]?.language}>
                                <label class="label">
                                    <p class="flex items-center">
                                        <span>Language</span>
                                        <Icon icon="mdi:language" width="16" />
                                        <sup class="text-red-500">*</sup>
                                    </p>
                                    <SearchableCombobox
                                        name="language"
                                        options={allLanguages}
                                        bind:value={$data.editions[tabSet].language}
                                        width="w-full"
                                    />
                                </label>
                            </ErrorMessage>
                        </div>
                        <div class="flex flex-col md:flex-row *:w-full gap-4 md:gap-8">
                            <ErrorMessage errors={$errors.editions?.[tabSet]?.authors}>
                                <AutocompleteInputChip
                                    options={allAuthors}
                                    title="Edition Specific Authors"
                                    name="edition-authors"
                                    placeholder="Search or add authors..."
                                    bind:selectedOptions={$data.editions[tabSet].authors}
                                />
                            </ErrorMessage>
                            <ErrorMessage errors={$errors.editions?.[tabSet]?.publishers}>
                                <AutocompleteInputChip
                                    options={allPublishers}
                                    title="Publishers"
                                    name="publishers"
                                    placeholder="Search or add publishers..."
                                    bind:selectedOptions={$data.editions[tabSet].publishers}
                                />
                            </ErrorMessage>
                        </div>
                    </div>

                    <PublishDate
                        bind:year={$data.editions[tabSet].publishDate.year}
                        bind:month={$data.editions[tabSet].publishDate.month}
                        bind:day={$data.editions[tabSet].publishDate.day}
                        errors={$errors.editions?.[tabSet]?.publishDate?._errors}
                        yearErrors={$errors.editions?.[tabSet]?.publishDate?.year}
                    />

                    <div class="space-y-2">
                        <h3 class="h3">Identifiers</h3>
                        <div class="flex gap-4 md:gap-8 *:grow">
                            <ErrorMessage errors={$errors.editions?.[tabSet]?.isbn10}>
                                <TextInputField
                                    text="ISBN 10"
                                    name="isbn10"
                                    bind:value={$data.editions[tabSet].isbn10}
                                    allowedRegex={formISBNRegex}
                                    placeholder="0123456789"
                                />
                            </ErrorMessage>
                            <ErrorMessage errors={$errors.editions?.[tabSet]?.isbn13}>
                                <TextInputField
                                    text="ISBN 13"
                                    name="isbn13"
                                    bind:value={$data.editions[tabSet].isbn13}
                                    allowedRegex={formISBNRegex}
                                    placeholder="9780123456789"
                                />
                            </ErrorMessage>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <h3 class="h3">Edition Cover</h3>
                        <ImageInput
                            name="image"
                            bind:file={$data.editions[tabSet].image}
                            bind:url={$imageStates[tabSet].url}
                            bind:hasError={$imageStates[tabSet].hasError}
                        />
                    </div>

                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <h3 class="h3">Copies</h3>
                            <button type="button" class="btn variant-filled-secondary btn-sm" onclick={createCopy}>
                                <Icon icon="mdi:plus" height="24" />
                                Add Copy
                            </button>
                        </div>
                        <div class="flex flex-col gap-4">
                            {#each $data.editions[tabSet].copies as _, index}
                                <div class="space-y-2 w-full border border-primary-500/10 p-3">
                                    <div class="flex justify-between items-center">
                                        <h4>Copy #{index + 1}</h4>
                                        <button type="button" class="btn hover:variant-soft duration-300 h-7 px-2" onclick={() => onDeleteCopy(index)}>
                                            <Icon icon="mdi:trash" height="24" class="mr-1" />
                                            Remove
                                        </button>
                                    </div>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Label text="Location" class="flex items-center gap-2" required>
                                            <Input
                                                id={`copy-location-${index}`}
                                                bind:value={$data.editions[tabSet].copies[index].location}
                                            />
                                        </Label>
                                        <Label text="Owner" class="flex items-center gap-2" required>
                                            <UserSelector
                                                name="copy-user-select-{index}"
                                                bind:value={$data.editions[tabSet].copies[index].ownerId}
                                                {users}
                                            />
                                        </Label>
                                    </div>
                                </div>
                            {:else}
                                <p class="text-sm text-surface-300">No copies added yet</p>
                            {/each}
                        </div>
                    </div>
                </div>
            </svelte:fragment>
        </TabGroup>
    </div>

	<div class="absolute bottom-6 w-1/2 left-1/2 -translate-x-1/2">
		<button type="submit" class="btn bg-primary-500 px-10 py-3 w-full">Submit</button>
	</div>
</form>
