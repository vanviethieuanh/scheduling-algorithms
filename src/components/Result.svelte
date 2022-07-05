<script lang="ts">
    import Table from '@components/common/Table.svelte'

    import type { Process } from '@logic/Process'

    export let finishedProcesses: Process[] = []
    const columnsMapper = [
        {
            title: 'Name',
            value: (v) => v.name,
        },
        {
            title: 'Arrival Time',
            value: (v) => v.arrivalTime,
        },
        {
            title: 'Burst Time',
            value: (v) => v.burstTime,
        },
        {
            title: 'Finish Time',
            value: (v) => v.finishedTime,
        },
        {
            title: 'Wait Time',
            value: (v) => v.waitTime,
        },
        {
            title: 'Turnaround Time',
            value: (v) => v.turnaroundTime,
        },
        {
            title: 'Response Time',
            value: (v) => v.responseTime,
        },
    ]
</script>

<Table data={finishedProcesses} {columnsMapper} />
