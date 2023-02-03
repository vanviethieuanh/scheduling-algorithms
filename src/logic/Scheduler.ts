import type { Process } from "@models/Process"

export type SchedulerOptions = {
    preemptive?: boolean
    quantumnTime?: number
}

function ClearProcessesCache(processes: Process[]): void {
    // Clear all cache
    processes.forEach((process) => process.clearCache())
    processes.forEach((process) => process.reset())
}

function ResponseRatio(process: Process, time: number): number {
    return (time - process.arrivalTime + process.burstTime) / process.burstTime
}

// Sortest job first (SJF) ** Non-Preemptive
/**
 * @param processes
 * @returns
 * @description
 * Shortest job next (SJN), also known as shortest job first (SJF) or shortest process next (SPN), is a scheduling policy that selects for execution the waiting process with the smallest execution time.[1] SJN is a non-preemptive algorithm. Shortest remaining time is a preemptive variant of SJN.
 * https://en.wikipedia.org/wiki/Shortest_job_next
 * */
export function SortestJobFirst(
    processes: Process[],
    options?: SchedulerOptions
): Process[] {
    // Clear all cache
    ClearProcessesCache(processes)

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

// ShortestRemainingTimeFirst (SRTF) ** Preemptive version of shortest job next scheduling algorithm.
/**
 * @param processes
 * @returns
 * @description
 Shortest remaining time, also known as shortest remaining time first (SRTF), is a scheduling method that is a preemptive version of shortest job next scheduling. In this scheduling algorithm, the process with the smallest amount of time remaining until completion is selected to execute. Since the currently executing process is the one with the shortest amount of time remaining by definition, and since that time should only reduce as execution progresses, the process will either run until it completes or get preempted if a new process is added that requires a smaller amount of time. 
 https://en.wikipedia.org/wiki/Shortest_remaining_time
 **/
export function ShortestRemainingTimeFirst(
    processes: Process[],
    options?: Object
): Process[] {
    // Clear all cache
    ClearProcessesCache(processes)

    // Get name order of processes
    const namesOrder = processes.map((p) => p.name)

    // Sort processes by arrival time
    processes.sort((a, b) => {
        return a.arrivalTime - b.arrivalTime
    })

    // Execute processes
    let time = processes[0].arrivalTime
    let finishedProcesses = []
    let arrivedProcessesAtCurrentTime: Process[] = []

    // Add first process to arrived processes
    arrivedProcessesAtCurrentTime.push(processes.shift())

    while (processes.length > 0 || arrivedProcessesAtCurrentTime.length > 0) {
        // get first process in arrived processes list
        let firstProcess = arrivedProcessesAtCurrentTime[0]

        // get time from now to next process arrival time
        let nextProcessArrivalTime = processes[0]?.arrivalTime ?? Infinity
        let timeToNextProcessArrivalTime = nextProcessArrivalTime - time

        // execute process for the minimum time between burst time and time to next process arrival time
        let timeToExecute = Math.min(
            firstProcess.remainingTime,
            timeToNextProcessArrivalTime
        )

        firstProcess.execute(timeToExecute, time)
        time += timeToExecute

        // add all arrived processes to arrived processes list
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

        // move all finished processes from arrived processes list to finished processes list
        arrivedProcessesAtCurrentTime = arrivedProcessesAtCurrentTime.filter(
            (process) => {
                if (process.isDone) {
                    finishedProcesses.push(process)
                    return false
                }
                return true
            }
        )

        // sort arrived processes by remaining time
        arrivedProcessesAtCurrentTime.sort((a, b) => {
            return a.remainingTime - b.remainingTime
        })
    }

    // Order finished processes by nameOrder
    finishedProcesses.sort((a, b) => {
        return namesOrder.indexOf(a.name) - namesOrder.indexOf(b.name)
    })
    return finishedProcesses
}

// First-Come, First-Served
/**
 * @param processes
 * @returns
 **/
export function FirstComeFirstServed(
    processes: Process[],
    options?: SchedulerOptions
): Process[] {
    // Clear all cache
    ClearProcessesCache(processes)

    // Sort processes by arrival time
    processes.sort((a, b) => {
        return a.arrivalTime - b.arrivalTime
    })

    let time = 0
    processes.forEach((process) => {
        process.execute(process.burstTime, time)
        time += process.burstTime
    })

    return processes
}

// Priority Scheduling
/**
 * @param processes
 * @returns
 **/
export function PreemptivePriorityScheduling(
    processes: Process[],
    options?: SchedulerOptions
): Process[] {
    // Clear all cache
    ClearProcessesCache(processes)

    // Get name order of processes
    const namesOrder = processes.map((p) => p.name)

    // Sort processes by arrival time
    processes.sort((a, b) => {
        return a.arrivalTime - b.arrivalTime
    })

    // Execute processes
    let time = processes[0].arrivalTime
    let finishedProcesses = []
    let arrivedProcessesAtCurrentTime: Process[] = []

    // Add first process to arrived processes
    arrivedProcessesAtCurrentTime.push(processes.shift())

    while (processes.length > 0 || arrivedProcessesAtCurrentTime.length > 0) {
        // get first process in arrived processes list
        let firstProcess = arrivedProcessesAtCurrentTime[0]

        // get time from now to next process arrival time
        let nextProcessArrivalTime = processes[0]?.arrivalTime ?? Infinity
        let timeToNextProcessArrivalTime = nextProcessArrivalTime - time

        // execute process for the minimum time between burst time and time to next process arrival time
        let timeToExecute = Math.min(
            firstProcess.remainingTime,
            timeToNextProcessArrivalTime
        )

        firstProcess.execute(timeToExecute, time)
        time += timeToExecute

        // add all arrived processes to arrived processes list
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

        // move all finished processes from arrived processes list to finished processes list
        arrivedProcessesAtCurrentTime = arrivedProcessesAtCurrentTime.filter(
            (process) => {
                if (process.isDone) {
                    finishedProcesses.push(process)
                    return false
                }
                return true
            }
        )

        // sort arrived processes by remaining time
        arrivedProcessesAtCurrentTime.sort((a, b) => {
            return a.priority - b.priority
        })
    }

    // Order finished processes by nameOrder
    finishedProcesses.sort((a, b) => {
        return namesOrder.indexOf(a.name) - namesOrder.indexOf(b.name)
    })
    return finishedProcesses
}

// Priority Scheduling
/**
 * @param processes
 * @returns
 **/
export function NonPreemptivePriorityScheduling(
    processes: Process[],
    options?: SchedulerOptions
): Process[] {
    // Clear all cache
    ClearProcessesCache(processes)

    // Get name order of processes
    const namesOrder = processes.map((p) => p.name)

    // Sort processes by arrival time
    processes.sort((a, b) => {
        return a.arrivalTime - b.arrivalTime
    })

    // Execute processes
    let time = processes[0].arrivalTime
    let finishedProcesses = []
    let arrivedProcessesAtCurrentTime: Process[] = []

    // Add first process to arrived processes
    arrivedProcessesAtCurrentTime.push(processes.shift())

    while (processes.length > 0 || arrivedProcessesAtCurrentTime.length > 0) {
        // get first process in arrived processes list
        let firstProcess = arrivedProcessesAtCurrentTime[0]

        // execute process for the minimum time between burst time and time to next process arrival time
        let timeToExecute = firstProcess.burstTime

        firstProcess.execute(timeToExecute, time)
        time += timeToExecute

        // add all arrived processes to arrived processes list
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

        // move all finished processes from arrived processes list to finished processes list
        arrivedProcessesAtCurrentTime = arrivedProcessesAtCurrentTime.filter(
            (process) => {
                if (process.isDone) {
                    finishedProcesses.push(process)
                    return false
                }
                return true
            }
        )

        // sort arrived processes by remaining time
        arrivedProcessesAtCurrentTime.sort((a, b) => {
            return a.priority - b.priority
        })
    }

    // Order finished processes by nameOrder
    finishedProcesses.sort((a, b) => {
        return namesOrder.indexOf(a.name) - namesOrder.indexOf(b.name)
    })
    return finishedProcesses
}

// Round Robin
export function RoundRobin(
    processes: Process[],
    options?: SchedulerOptions
): Process[] {
    const quantumnTime = options?.quantumnTime ?? 1
    // Clear all cache
    ClearProcessesCache(processes)

    // Get name order of processes
    const namesOrder = processes.map((p) => p.name)

    // Sort processes by arrival time
    processes.sort((a, b) => {
        return a.arrivalTime - b.arrivalTime
    })

    // Execute processes
    let time = processes[0].arrivalTime
    let finishedProcesses = []
    let arrivedProcessesAtCurrentTime: Process[] = []

    // Add first process to arrived processes
    arrivedProcessesAtCurrentTime.push(processes.shift())

    while (processes.length > 0 || arrivedProcessesAtCurrentTime.length > 0) {
        // get first process in arrived processes list
        let firstProcess = arrivedProcessesAtCurrentTime.shift()

        // execute process for the minimum time between burst time and time to next process arrival time
        let timeToExecute = Math.min(firstProcess.remainingTime, quantumnTime)

        firstProcess.execute(timeToExecute, time)
        time += timeToExecute

        // add all arrived processes to arrived processes list
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

        arrivedProcessesAtCurrentTime.push(firstProcess)

        // move all finished processes from arrived processes list to finished processes list
        arrivedProcessesAtCurrentTime = arrivedProcessesAtCurrentTime.filter(
            (process) => {
                if (process.isDone) {
                    finishedProcesses.push(process)
                    return false
                }
                return true
            }
        )
    }

    // Order finished processes by nameOrder
    finishedProcesses.sort((a, b) => {
        return namesOrder.indexOf(a.name) - namesOrder.indexOf(b.name)
    })
    return finishedProcesses
}

// Highest Response Ratio Next
export function HighestResponseRatioNext(
    processes: Process[],
    options?: SchedulerOptions
): Process[] {
    // Clear all cache
    ClearProcessesCache(processes)

    // Get name order of processes
    const namesOrder = processes.map((p) => p.name)

    // Sort processes by arrival time
    processes.sort((a, b) => {
        return a.arrivalTime - b.arrivalTime
    })

    // Execute processes
    let time = processes[0].arrivalTime
    let finishedProcesses = []
    let arrivedProcessesAtCurrentTime: Process[] = []

    // Add first process to arrived processes
    arrivedProcessesAtCurrentTime.push(processes.shift())

    while (processes.length > 0 || arrivedProcessesAtCurrentTime.length > 0) {
        // get first process in arrived processes list
        let firstProcess = arrivedProcessesAtCurrentTime[0]

        // execute process for the minimum time between burst time and time to next process arrival time
        let timeToExecute = firstProcess.burstTime

        firstProcess.execute(timeToExecute, time)
        time += timeToExecute

        // add all arrived processes to arrived processes list
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

        // move all finished processes from arrived processes list to finished processes list
        arrivedProcessesAtCurrentTime = arrivedProcessesAtCurrentTime.filter(
            (process) => {
                if (process.isDone) {
                    finishedProcesses.push(process)
                    return false
                }
                return true
            }
        )

        // sort arrived processes by RR
        arrivedProcessesAtCurrentTime.sort((a, b) => {
            return ResponseRatio(b, time) - ResponseRatio(a, time)
        })
    }

    // Order finished processes by nameOrder
    finishedProcesses.sort((a, b) => {
        return namesOrder.indexOf(a.name) - namesOrder.indexOf(b.name)
    })
    return finishedProcesses
}

// Multilevel Queue
export function MultilevelQueue(
    processes: Process[],
    options?: SchedulerOptions
): Process[] {
    return processes
}

// Multilevel Feedback Queue
export function MultilevelFeedbackQueue(
    processes: Process[],
    options?: SchedulerOptions
): Process[] {
    return processes
}
