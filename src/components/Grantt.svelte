<script lang="ts">
    import type { GranttPeriod } from '@models/GranttPeriod'

    export let runs: GranttPeriod[] = []

    $: cols = Math.max(...runs.map(run => run.periodEnd))
    $: processesName = [...new Set(runs.map(run => run.periodName))]
</script>

<div>
    {#each runs as run}
        <p>{run.periodName}-{run.periodStart}-{run.periodEnd}</p>
    {/each}
    {cols}
    <table>
        {#each processesName as name}
            <tr>
                <td>{name}</td>
                <td>
                    <div class="bar" style="{`--cols: ${cols}`}">
                        {#each runs as run}
                            {#if run.periodName === name}
                                <div class="grantt" style="{`--start: ${run.periodStart+1};--end: ${run.periodEnd+1}`}">

                                </div>
                            {/if}
                        {/each}
                    </div>
                </td>
            </tr>
        {/each}
    </table>
</div>

<style>
    .bar{
        display: grid;
        grid-template-columns: repeat(var(--cols), 1fr 50px);
        height: 100%;
    }

    .grantt{
        background-color: black;
        height: 30px;
        grid-column: var(--start) / var(--end);
    }
</style>