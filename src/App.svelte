<script lang="ts">
    // Import components
    import Table from "@components/common/Table.svelte"

    // Import logics
    import { Process } from "@models/Process"
    import * as Scheduler from "@logic/Scheduler"

    // Import store variables
    import { processes } from "@store"
    import Grantt from "@components/Grantt.svelte"

    let inputProcesses = [
        new Process("A", 0, 5, 1),
        new Process("B", 1, 4, 2),
        new Process("C", 2, 3, 3),
        new Process("D", 3, 2, 4),
        new Process("E", 4, 1, null),
    ]

    // define column configs
    const inputColumnsMapper = [
        {
            title: "Name",
            dataType: "text",
            getter: (v) => v.name,
            setter: (process, value) => {
                process.name = value
            },
        },
        {
            title: "Arrival Time",
            dataType: "number",
            getter: (v) => v.arrivalTime,
            setter: (process, value) => {
                process.arrivalTime = value
            },
            min: 1,
        },
        {
            title: "Burst Time",
            dataType: "number",
            getter: (v) => v.burstTime,
            setter: (process, value) => {
                process.burstTime = value
            },
            min: 1,
        },
        {
            title: "Priority",
            dataType: "number",
            getter: (v) => (v.priority ? v.priority : "0"),
            setter: (process, value) => {
                process.priority = value
            },
        },
    ]

    const resultColumnsMapper = [
        {
            title: "Name",
            dataType: "text",
            getter: (v) => v.name,
            setter: (obj, value) => {
                throw "Not Implemented"
            },
        },
        {
            title: "Finish Time",
            dataType: "number",
            getter: (v) => v.finishedTime,
            setter: (obj, value) => {
                throw "Not Implemented"
            },
        },
        {
            title: "Wait Time",
            dataType: "text",
            getter: (v) => v.waitTime,
            setter: (obj, value) => {
                throw "Not Implemented"
            },
        },
        {
            title: "Turnaround Time",
            dataType: "text",
            getter: (v) => v.turnaroundTime,
            setter: (obj, value) => {
                throw "Not Implemented"
            },
        },
        {
            title: "Response Time",
            dataType: "text",
            getter: (v) => v.responseTime,
            setter: (obj, value) => {
                throw "Not Implemented"
            },
        },
    ]

    // Clone MockProcesses to pass to SJF
    $: result = Scheduler.SJF(inputProcesses.slice())

    $: averageWaitTime =
        result.reduce((acc, v) => acc + v.waitTime, 0) / result.length
    $: averageResponseTime =
        result.reduce((acc, v) => acc + v.responseTime, 0) / result.length
    $: averageTurnaroundTime =
        result.reduce((acc, v) => acc + v.turnaroundTime, 0) / result.length

    $: runs = result.map((process) => process.toGranttPeriods()).flat()

    function updateInput(event) {
        inputProcesses = event.detail.data
    }
</script>

<main>
    <div class="grid-displayer">
        <div class="table-container">
            <Table
                bind:data={inputProcesses}
                columnsMapper={inputColumnsMapper}
                editable={true}
                copyable={false}
                entityName="process"
                on:change={updateInput}
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
    <div>
        <Grantt {runs} />
    </div>
</main>

<style
    global
    lang="postcss"
>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @import "https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css";

    main {
        font-family: "Montserrat", sans-serif;

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
