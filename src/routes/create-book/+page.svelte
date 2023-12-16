<script lang="ts">
    import type { PageData } from "./$types"
    import { page } from "$app/stores"
    import { enhance } from "$app/forms"

    import { Autocomplete, InputChip, FileDropzone, getToastStore, ListBox, ListBoxItem } from '@skeletonlabs/skeleton'
    import type { AutocompleteOption, ToastSettings } from '@skeletonlabs/skeleton'
    import Icon from "@iconify/svelte"

    import PublishDate from "$lib/components/book-form/PublishDate.svelte"
    import type { SubmitFunction } from "@sveltejs/kit";
    import { goto } from "$app/navigation";
    import NotLoggedIn from "$lib/components/NotLoggedIn.svelte";


    export let data: PageData
    let {
        authors: dbAuthors,
        publishers: dbPublishers,
        locations: dbLocations,
        subjects: dbSubjects,
        languages: dbLanguages
    } = data

    let isbn = $page.url.searchParams.get("isbn")

    const toastStore = getToastStore()

    //#region --------------------------------------------------- Authors Input
    let authorInputValue = ""
    let authorsList: string[] = []
    const authors: AutocompleteOption[] = [
        ...dbAuthors.map(author => ({
            label: author.name,
            value: author.name
        }))
    ]

    function onAuthorSelect(event: CustomEvent<AutocompleteOption>) {
        if (authorsList.includes(event.detail.value as string) === false) {
            authorsList = [...authorsList, event.detail.value as string]
			authorInputValue = ""
		}
    }

    //#endregion
    //#region ------------------------------------------------ Publishers Input
    let publisherInputValue = ""
    let publisherList: string[] = []
    const publishers: AutocompleteOption[] = [
        ...dbPublishers.map(publisher => ({
            label: publisher.name,
            value: publisher.name
        }))
    ]

    function onPublisherSelect(event: CustomEvent<AutocompleteOption>) {
        if (publisherList.includes(event.detail.value as string) === false) {
            publisherList = [...publisherList, event.detail.value as string]
			publisherInputValue = ""
		}
    }

    //#endregion
    //#region -------------------------------------------------- Subjects Input
    let subjectInputValue = ""
    let subjectsList: string[] = []
    const subjects: AutocompleteOption[] = [
        ...dbSubjects.map(subject => ({
            label: subject.value,
            value: subject.value
        }))
    ]

    function onSubjectSelect(event: CustomEvent<AutocompleteOption>): void {
        if (subjectsList.includes(event.detail.value as string) === false) {
            subjectsList = [...subjectsList, event.detail.value as string]
			subjectInputValue = ""
		}
	}

    //#endregion
    //#region ---------------------------------------------------- Images Input
    const fileSizeLimit = 16 // MB

    function MB2Bytes(mb: number): number {
        return mb * 1000000
    }

    let frontImageSrc: string
    let backImageSrc: string

    async function getDataURLImage(image: File): Promise<string | null> {
        if (!image) return null
        if (image.size > MB2Bytes(fileSizeLimit)) {
            triggerError(`Image size can not exceeded ${fileSizeLimit} MB`)
            return null
        }

        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(image)
        })
    }

    async function onFrontImageChange(ev: any) {
        const image: File = ev.target.files[0]
        const url = await getDataURLImage(image)
        frontImageSrc = url ?? ""
    }

    async function onBackImageChange(ev: any) {
        const image: File = ev.target.files[0]
        const url = await getDataURLImage(image)
        backImageSrc = url ?? ""
    }

    //#endregion
    //#region -------------------------------------------------- Location Input
    let locationSelected: string
    let addLocationValue: string
    let locations = dbLocations.map(loc => loc.value)

    function addBookLocation() {
        if (!addLocationValue || locations.includes(addLocationValue))
            return
        locations = [...locations, addLocationValue]
        locationSelected = addLocationValue
        addLocationValue = ""
    }

    function addLocationKeyDown(ev: KeyboardEvent) {
        if (ev.key == "Enter") {
            ev.preventDefault()
            addBookLocation()
        }
    }

    //#endregion
    //#region -------------------------------------------------- Language Input
    let languageSelected: string
    let addLanguageValue: string
    let languages = dbLanguages.map(lang => lang.value)

    function addBookLanguage() {
        if (!addLanguageValue || languages.includes(addLanguageValue))
            return
        languages = [...languages, addLanguageValue]
        languageSelected = addLanguageValue
        addLanguageValue = ""
    }

    function addLanguageKeyDown(ev: KeyboardEvent) {
        if (ev.key == "Enter") {
            ev.preventDefault()
            addBookLanguage()
        }
    }

    //#endregion

    function triggerError(message: string) {
        toastStore.trigger({
            message: message,
            background: "variant-filled-error"
        })
    }

    const enhanceHandler: SubmitFunction<
        Record<string, any>,
        { message: string }
    > = function({ formData }) {

        for (const [key, value] of Array.from(formData.entries())) {
            if ((typeof value == "string" && value == "") ||
            (typeof value == "object" && (value as File).name == "")
            ) {
                formData.delete(key)
            }
        }

        return ({ result }) => {
            if (result.type == "failure" && result.data?.message) {
                triggerError(result.data.message)
            }
            else if (result.type == "redirect") {
                toastStore.trigger({
                    message: "Book Creating Successful",
                    background: "variant-filled-success"
                })
                goto(result.location)
            }
        }
    }
</script>

{#if $page.data.user}
    <form
        class="space-y-6"
        method="post"
        enctype="multipart/form-data"
        use:enhance={enhanceHandler}
    >
        <h2 class="h2">Book Creation</h2>

        <label class="label">
            <span>ISBN<sup class="text-red-500">*</sup></span>
            <input class="input" type="number" name="isbn" bind:value={isbn} required/>
        </label>

        <label class="label">
            <span>Title<sup class="text-red-500">*</sup></span>
            <input class="input" type="text" name="title" required />
        </label>

        <label class="label">
            <span>Subtitle</span>
            <input class="input" type="text" name="subtitle" />
        </label>

        <label class="label">
            <span>Number of pages</span>
            <input class="input" type="number" name="number_of_pages" />
        </label>

        <PublishDate/>

        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label">
            <span>Authors</span>
            <InputChip bind:input={authorInputValue} bind:value={authorsList} name="author" placeholder="Enter Author..." allowUpperCase />
            <div class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto" tabindex="-1">
                <Autocomplete
                    bind:input={authorInputValue}
                    options={authors}
                    denylist={authorsList}
                    on:selection={onAuthorSelect}
                />
            </div>
        </label>

        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label">
            <span>Publishers</span>
            <InputChip bind:input={publisherInputValue} bind:value={publisherList} name="publisher" placeholder="Enter Publisher..." allowUpperCase />
            <div class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto" tabindex="-1">
                <Autocomplete
                    bind:input={publisherInputValue}
                    options={publishers}
                    denylist={publisherList}
                    on:selection={onPublisherSelect}
                />
            </div>
        </label>

        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label">
            <span>Subjects</span>
            <InputChip bind:input={subjectInputValue} bind:value={subjectsList} name="subject" allowUpperCase />
            <div class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto" tabindex="-1">
                <Autocomplete
                    bind:input={subjectInputValue}
                    options={subjects}
                    denylist={subjectsList}
                    on:selection={onSubjectSelect}
                />
            </div>
        </label>

        <!-- svelte-ignore a11y-label-has-associated-control -->
        <div class="flex gap-6">
            <div class="flex flex-col space-y-2 w-full">
                <label class="label">Front Image</label>
                <FileDropzone name="front_image" accept="image/*" on:change={onFrontImageChange}>
                    <svelte:fragment slot="lead">
                        <div class="flex justify-center">
                            <Icon icon="uil:image-upload" color="white" width="32" height="32" />
                        </div>
                    </svelte:fragment>
                </FileDropzone>
                {#if frontImageSrc}
                    <img src={frontImageSrc} alt="Book Front" class="w-full">
                {/if}
            </div>
            <div class="flex flex-col space-y-2 w-full">
                <label class="label">Back Image</label>
                <FileDropzone name="back_image" accept="image/*" on:change={onBackImageChange}>
                    <svelte:fragment slot="lead">
                        <div class="flex justify-center">
                            <Icon icon="uil:image-upload" color="white" width="32" height="32" />
                        </div>
                    </svelte:fragment>
                </FileDropzone>
                {#if backImageSrc}
                    <img src={backImageSrc} alt="Book Back" class="w-full">
                {/if}
            </div>
        </div>

        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label flex flex-col gap-2">
            <span>Book Location</span>
            <ListBox class="border border-dashed border-surface-600-300-token">
                {#each locations as loc}
                    <ListBoxItem bind:group={locationSelected} name="location" value={loc}>{loc}</ListBoxItem>
                {/each}
            </ListBox>
            <div class="input-group input-group-divider grid-cols-[1fr_auto]">
                <input placeholder="Add Location..." bind:value={addLocationValue} on:keydown={addLocationKeyDown}/>
                <button type="button" class="variant-filled-secondary !px-10" on:click={addBookLocation}>Add</button>
            </div>
        </label>

        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label flex flex-col gap-2">
            <span>Book Language</span>
            <ListBox class="border border-dashed border-surface-600-300-token">
                {#each languages as lang}
                    <ListBoxItem bind:group={languageSelected} name="language" value={lang}>{lang}</ListBoxItem>
                {/each}
            </ListBox>
            <div class="input-group input-group-divider grid-cols-[1fr_auto]">
                <input placeholder="Add Language..." bind:value={addLanguageValue} on:keydown={addLanguageKeyDown}/>
                <button type="button" class="variant-filled-secondary !px-10" on:click={addBookLanguage}>Add</button>
            </div>
        </label>

        <div class="flex justify-center !mt-16">
            <button type="submit" class="btn bg-primary-500 px-10 py-3">Submit</button>
        </div>
    </form>
{:else}
    <NotLoggedIn/>
{/if}
