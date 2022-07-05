export class Process {
    readonly name: string
    readonly arrivalTime: number
    readonly burstTime: number
    readonly priority?: number

    private _finishedTime: number = null
    public get finishedTime() {
        return this._finishedTime
    }

    private _waitTime: number
    public get waitTime() {
        return this._waitTime
    }

    private _turnaroundTime: number
    public get turnaroundTime() {
        return this._turnaroundTime
    }

    private _responseTime: number = null
    public get responseTime() {
        return this._responseTime
    }

    private _remainingTime: number
    private _executionPeriods: [number, number][] = []

    constructor(name, arrivalTime, burstTime, priority) {
        this.name = name
        this.arrivalTime = arrivalTime
        this.burstTime = burstTime
        this.priority = priority
        this._remainingTime = burstTime
        this._waitTime = 0
        this._turnaroundTime = 0
    }

    execute(time, currentTime) {
        this._remainingTime -= time
        this._executionPeriods.push([currentTime, currentTime + time])

        if (this._responseTime === null) {
            console.log(`${this.name} started executing at ${currentTime}`)
            this._responseTime = currentTime - this.arrivalTime
        }

        if (this._remainingTime <= 0) {
            this._finishedTime = currentTime + time
            this._waitTime =
                this._finishedTime - this.arrivalTime - this.burstTime
            this._turnaroundTime = this._finishedTime - this.arrivalTime
        }
    }
}
