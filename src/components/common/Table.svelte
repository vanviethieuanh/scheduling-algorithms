<script lang="ts">
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
                    <td>{column.value(item)}</td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>
