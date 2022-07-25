export class GranttPeriod {
    private _periodName: string
    public get periodName() {
        return this._periodName
    }

    private _periodStart: number
    public get periodStart() {
        return this._periodStart
    }

    private _periodEnd: number
    public get periodEnd() {
        return this._periodEnd
    }

    constructor(periodName, periodStart, periodEnd) {
        this._periodName = periodName
        this._periodStart = periodStart
        this._periodEnd = periodEnd
    }
}
