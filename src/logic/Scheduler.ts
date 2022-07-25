import type { Process } from '@models/Process'

// Sortest job first (SJF)
export function SJF(processes: Process[]) {
    // Get name order of processes
    const namesOrder = processes.map((p) => p.name)

    // Sort processes by arrival time
    processes.sort((a, b) => {
        return a.arrivalTime - b.arrivalTime
    })

    // Execute processes
    let time = processes[0].arrivalTime
    let finishedProcesses = []
    let arrivedProcessesAtCurrentTime = []

    // Add first process to arrived processes
    arrivedProcessesAtCurrentTime.push(processes.shift())

    while (arrivedProcessesAtCurrentTime.length > 0) {
        // Execute first process in arrived processes list and remove it from list
        let firstProcess = arrivedProcessesAtCurrentTime.shift()
        firstProcess.execute(firstProcess.burstTime, time)
        time += firstProcess.burstTime

        console.log(
            `Process ${firstProcess.name} finished at ${firstProcess.finishedTime}`
        )
        console.log(arrivedProcessesAtCurrentTime)

        // Add finished process to list
        finishedProcesses.push(firstProcess)

        // Get all processes that arrived at the current time and add them to arrived processes list then remove them from processes list
        if (processes.length > 0) {
            let arrivedProcesses = processes.filter((process) => {
                return process.arrivalTime <= time
            })
            arrivedProcessesAtCurrentTime =
                arrivedProcessesAtCurrentTime.concat(arrivedProcesses)
            processes = processes.filter((process) => {
                return process.arrivalTime > time
            })
        }

        // Sort by burst time
        arrivedProcessesAtCurrentTime.sort((a, b) => {
            return a.burstTime - b.burstTime
        })
    }

    // Order finished processes by nameOrder
    finishedProcesses.sort((a, b) => {
        return namesOrder.indexOf(a.name) - namesOrder.indexOf(b.name)
    })
    return finishedProcesses
}
