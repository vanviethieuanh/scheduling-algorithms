<script lang="ts">
    // Components
    import Table from "@components/Table.svelte"
    import Grantt from "@components/Grantt.svelte"
    import Algorithms from "@components/Algorithms.svelte"

    // Logics
    import { Process } from "@models/Process"
    import * as Scheduler from "@logic/Scheduler"

    let inputProcesses = [
        new Process("P-1", 0, 5, 1),
        new Process("P-2", 1, 4, 2),
        new Process("P-3", 2, 3, 3),
        new Process("P-4", 3, 2, 4),
        new Process("P-5", 4, 1, null),
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
            editable: true,
        },
        {
            title: "Arrival Time",
            dataType: "number",
            getter: (v) => v.arrivalTime,
            setter: (process, value) => {
                process.arrivalTime = value
            },
            min: 1,
            editable: true,
        },
        {
            title: "Burst Time",
            dataType: "number",
            getter: (v) => v.burstTime,
            setter: (process, value) => {
                process.burstTime = value
            },
            min: 1,
            editable: true,
        },
        {
            title: "Priority",
            dataType: "number",
            getter: (v) => (v.priority ? v.priority : "0"),
            setter: (process, value) => {
                process.priority = value
            },
            editable: true,
        },
        {
            title: "Finish Time",
            dataType: "number",
            getter: (v) => v.finishedTime,
            setter: (obj, value) => {
                throw "Not Implemented"
            },
            copyable: true,
        },
        {
            title: "Wait Time",
            dataType: "text",
            getter: (v) => v.waitTime,
            setter: (obj, value) => {
                throw "Not Implemented"
            },
            copyable: true,
        },
        {
            title: "Turnaround Time",
            dataType: "text",
            getter: (v) => v.turnaroundTime,
            setter: (obj, value) => {
                throw "Not Implemented"
            },
            copyable: true,
        },
        {
            title: "Response Time",
            dataType: "text",
            getter: (v) => v.responseTime,
            setter: (obj, value) => {
                throw "Not Implemented"
            },
            copyable: true,
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
    <div class="container">
        <Grantt {runs} />
        <Algorithms />
        <div class="table">
            <Table
                bind:data={inputProcesses}
                columnsMapper={inputColumnsMapper}
                on:change={updateInput}
            />
        </div>
    </div>
</main>

<style
    global
    lang="scss"
>
    @import "https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css";

    main {
        font-family: "Montserrat", sans-serif;

        text-align: center;
        margin: 0;

        backdrop-filter: blur(50px);
        background-color: rgba(0, 0, 50, 0.2);
        height: 100%;
    }

    .component {
        background-color: rgba(255, 255, 255, 0.6);
        padding: 1rem;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba($color: #000030, $alpha: 0.1);
        user-select: none;
    }

    .container {
        padding: 3rem 2rem;
        max-width: 1400px;
        margin: 0 auto;
    }
    .table {
        margin-top: 50px;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
