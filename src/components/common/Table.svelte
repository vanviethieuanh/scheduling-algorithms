<script lang="ts">
    import { Process } from "@models/Process"
    import { createEventDispatcher } from "svelte"

    const dispatch = createEventDispatcher()

    export let entityName: string = "Row"
    export let editable: boolean = false
    export let copyable: boolean = false

    export let columnsMapper: {
        title: string
        dataType: string
        min?: number
        getter: Function
        setter: Function
    }[] = []
    export let data: Object[] = []

    export let copyMapper: Function = (values) => {
        // Concat all values into a single string separated by commas
        return values.join(",")
    }

    function copy(event: Event, value: Function) {
        const values = data.map((p) => value(p))
        const clipboard = copyMapper(values)

        navigator.clipboard.writeText(clipboard)
    }

    function numberPostHandler(event: Event, setter: Function, index: number) {
        const input = event.target as HTMLInputElement
        const value = Number(input.value)

        input.value = value.toString()
        setter(data[index], value)

        dispatch("change", {
            data: data,
        })
    }

    function deleteRow(event: Event, index: number) {
        data = data.filter((_, i) => i !== index)
    }

    function addRow(event: Event) {
        data = [...data, new Process("New Process", 0, 0, 0)]
    }
</script>

<table>
    <thead>
        <tr>
            {#each columnsMapper as column}
                {#if copyable}
                    <th>
                        <button
                            class="rounded px-3 py-2 m-1 border-b-4 border-l-2 shadow-lg bg-blue-700 border-blue-800"
                            on:click={(e) => copy(e, column.getter)}
                        >
                            {column.title}
                            <i class="fa-regular fa-clone" />
                        </button>
                    </th>
                {:else}
                    <th>
                        {column.title}
                    </th>
                {/if}
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each data as item, rowIndex}
            <tr>
                {#each columnsMapper as column, columnIndex}
                    <td>
                        {#if editable}
                            {#if column.dataType === "number"}
                                <input
                                    type={column.dataType}
                                    min={column.min ?? "unset"}
                                    disabled={!editable}
                                    value={column.getter(item)}
                                    on:input={(e) =>
                                        numberPostHandler(
                                            e,
                                            column.setter,
                                            rowIndex
                                        )}
                                />
                            {:else}
                                <input
                                    type="text"
                                    value={column.getter(item)}
                                />
                            {/if}
                        {:else}
                            {column.getter(item)}
                        {/if}
                    </td>
                {/each}

                <!-- Delete button in the end of each line if Editable -->
                {#if editable}
                    <td>
                        <button
                            name="delete"
                            on:click={(e) => deleteRow(e, rowIndex)}
                        >
                            <i class="fa-solid fa-minus" />
                        </button>
                    </td>
                {/if}
            </tr>
        {/each}
    </tbody>
</table>

{#if editable}
    <button
        id="add-row"
        on:click={(e) => addRow(e)}
    >
        <i class="fa-solid fa-plus" /> Add {entityName}</button
    >
{/if}

<style
    global
    lang="postcss"
>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    #add-row {
        width: 100%;
    }
    table {
        width: 100%;
        table-layout: auto;
    }
    th {
        font-weight: 600;
    }
    td {
        width: fit-content;
    }
    input {
        width: 100%;
    }

    thead button {
        font-size: 14px;
    }
</style>
