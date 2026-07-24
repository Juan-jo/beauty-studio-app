import { DayOfWeek } from "../../../../core/pipes/mx-dayofweek-pipe"

export interface EmplScheduleItem {
    id: number,
    dayOfWeek: DayOfWeek
    startTime: string,
    endTime: string
    enabled: boolean
    workingMinutes: number
    breaks: EmplBreak[]
}


export interface EmplBreak {
    startTime: string,
    endTime: string
}


export type EmplScheduleResponse = EmplScheduleItem[];