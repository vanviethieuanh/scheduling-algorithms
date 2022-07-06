<script lang="ts">
    export let editable = false
    export let columnsMapper: { title: string; value: Function }[] = []
    export let data: Object[] = []
</script>

<table>
    <thead>
        <tr>
            {#each columnsMapper as column}
                <th>{column.title}</th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each data as item}
            <tr>
                {#each columnsMapper as column}
                    <td>
                        <div contenteditable={editable}>
                            {column.value(item)}
                        </div>
                    </td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>
