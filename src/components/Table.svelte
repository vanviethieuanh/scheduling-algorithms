<script lang="ts">
    import { Process } from "@models/Process"
    import { createEventDispatcher } from "svelte"
    import { DefaultCopyMapper } from "@utils/DefaultMappers"

    type ColumnMapper = {
        title: string
        dataType: string
        min?: number
        editable?: boolean
        copyable?: boolean
        copyMapper?: Function
        getter: Function
        setter: Function
    }

    const dispatch = createEventDispatcher()
    let nameIndex = 0

    export let columnsMapper: ColumnMapper[] = []
    export let data: Object[] = []

    function copy(event: Event, value: Function, copyMapper?: Function) {
        const values = data.map((p) => value(p))
        const clipboard = copyMapper
            ? copyMapper(values)
            : DefaultCopyMapper(values)

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
        data = [...data, new Process(`P-${nameIndex}`, 0, 1, 0)]
        nameIndex += 1
    }
</script>

<div class="component">
    <table>
        <thead>
            <tr>
                {#each columnsMapper as column}
                    <th>
                        <div class="header">
                            <h5>{column.title}</h5>
                            {#if column.copyable}
                                <button
                                    disabled={!column.copyable}
                                    on:click={(e) =>
                                        copy(
                                            e,
                                            column.getter,
                                            column.copyMapper
                                        )}
                                >
                                    <i class="fa-solid fa-copy" />
                                </button>
                            {/if}
                        </div>
                    </th>
                {/each}
                <button
                    id="add-row"
                    on:click={(e) => addRow(e)}
                >
                    <i class="fa-solid fa-plus" /></button
                >
            </tr>
        </thead>
        <tbody>
            {#each data as item, rowIndex}
                <tr>
                    {#each columnsMapper as column, columnIndex}
                        <td>
                            {#if column.editable}
                                {#if column.dataType === "number"}
                                    <input
                                        type={column.dataType}
                                        min={column.min ?? "unset"}
                                        disabled={!column.editable}
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

                    <!-- Delete button in the end of each line. -->
                    <td>
                        <button
                            name="delete"
                            on:click={(e) => deleteRow(e, rowIndex)}
                        >
                            <i class="fa-solid fa-trash-can" />
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style lang="scss">
    #add-row {
        margin: 0 1rem;
        font-size: 1rem;

        background-color: rgba($color: #fff, $alpha: 0.2);
        border: rgba($color: #fff, $alpha: 0.2) 1px solid;
    }
    table {
        width: 100%;
    }
    th {
        font-weight: 600;
    }
    td {
        vertical-align: middle;
        text-align: center;

        input {
            max-width: 100px;

            vertical-align: middle;
            text-align: center;

            background-color: rgba($color: #fff, $alpha: 0.3);
            border: none;
            border-radius: 3px;
            margin: 0.5rem 0;

            &:hover {
                background-color: rgba($color: #fff, $alpha: 0.7);
            }
            &:focus {
                background-color: rgba($color: #fff, $alpha: 0.7);
                box-shadow: 0 0 10px rgba($color: #000030, $alpha: 0.1);
                outline: none;
            }
        }
    }
    tr {
        border-bottom: 1px solid rgba($color: #000030, $alpha: 0.1);
        &:last-child {
            border-bottom: none;
        }
    }
    input {
        width: 100%;
    }

    thead button {
        font-size: 14px;
    }
    .header {
        display: flex;
        align-items: center;
        justify-content: center;
        button {
            margin-left: 1rem;
        }
    }
    button {
        margin: 0;

        $button-size: 32px;

        color: rgba($color: #000030, $alpha: 0.4);
        background-color: rgba($color: #fff, $alpha: 0);
        border: rgba($color: #fff, $alpha: 0) 1px solid;

        border-radius: 5px;

        width: $button-size;
        height: $button-size;

        cursor: pointer;

        &:hover {
            color: rgba($color: #000030, $alpha: 0.8);
        }
    }
</style>
