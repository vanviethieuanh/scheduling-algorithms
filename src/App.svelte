<script lang="ts">
    // Import components
    import Result from './components/Result.svelte'

    // Import logics
    import { Process } from '@logic/Process'
    import { SJF } from '@logic/Scheduler'

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
            value: (v) => (v.priority ? v.priority : '-'),
        },
    ]

    // Clone MockProcesses to pass to SJF
    let result = SJF([
        new Process('A', 0, 5, 1),
        new Process('B', 1, 4, 2),
        new Process('C', 2, 3, 3),
        new Process('D', 3, 2, 4),
        new Process('E', 4, 1, null),
    ])
</script>

<main>
    {@debug result}

    <Result finishedProcesses={result} />

    <p>
        Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
        how to build Svelte apps.
    </p>
</main>

<style>
    @import 'https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css';
    main {
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
