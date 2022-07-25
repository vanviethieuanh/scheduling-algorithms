<script lang="ts">
    // Import components
    import Table from '@components/common/Table.svelte'
    import Result from '@components/Result.svelte'

    // Import logics
    import { Process } from '@logic/Process'
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

    // Clone MockProcesses to pass to SJF
    $: result = Scheduler.SJF(mockProcesses.slice())
</script>

<main>
    <h1 class="text-3xl font-bold underline">Input</h1>
    <Table
        data={mockProcesses}
        columnsMapper={inputColumnsMapper}
        columnInputTypes={['text', 'number', 'number', 'number']}
        editable={true}
        copyable={false}
    />
    <h1>Result</h1>
    <Result finishedProcesses={result} />
    <h1>Gantt Chart</h1>
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

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
