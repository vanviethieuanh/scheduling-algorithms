<script lang="ts">
    // Import components
    import Table from '@components/common/Table.svelte'

    // Import logics
    import { Process } from '@models/Process'
    import * as Scheduler from '@logic/Scheduler'

    // Import store variables
    import { processes } from '@store'

    const mockProcesses = [
        new Process('A', 0, 5, 1),
        new Process('B', 1, 4, 2),
        new Process('C', 2, 3, 3),
        new Process('D', 3, 2, 4),
        new Process('E', 4, 1, null),
    ]

    // define column configs
    const inputColumnsMapper = [
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
            title: 'Priority',
            value: (v) => (v.priority ? v.priority : '0'),
        },
    ]

    const resultColumnsMapper = [
        {
            title: 'Name',
            value: (v) => v.name,
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

    // Clone MockProcesses to pass to SJF
    $: result = Scheduler.SJF(mockProcesses.slice())

    $: averageWaitTime =
        result.reduce((acc, v) => acc + v.waitTime, 0) / result.length
    $: averageResponseTime =
        result.reduce((acc, v) => acc + v.responseTime, 0) / result.length
    $: averageTurnaroundTime =
        result.reduce((acc, v) => acc + v.turnaroundTime, 0) / result.length
</script>

<main>
    <div class="grid-displayer">
        <div class="table-container">
            <Table
                data={mockProcesses}
                columnsMapper={inputColumnsMapper}
                columnInputTypes={['text', 'number', 'number', 'number']}
                editable={true}
                copyable={false}
                entityName="process"
            />
        </div>

        <div class="result-container">
            <Table
                columnsMapper={resultColumnsMapper}
                data={result}
                editable={false}
                copyable={true}
            />
        </div>
    </div>
</main>

<style>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @import 'https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css';
    main {
        font-family: 'Montserrat', sans-serif;

        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    .table-container {
        width: 40%;
    }

    .result-container {
        width: 50%;
    }

    .grid-displayer {
        display: flex;
        justify-content: space-around;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
