
export interface SalonResume {
    salonName           : string 
    totalServices       : number
    totalEmployees      : number
}

export interface SalonService  {
    serviceId           : number
    name                : string
    description         : string
    durationMinutes     : number
    price               : string
    enabled             : boolean,
    pictureUrl          : string
}

export type SalonServicesResponse = SalonService [];


export interface SalonEmployee  {
    employeeId          : number
    name                : string
    specialty           : string
    pictureUrl          : string
    workingHours        : number
    services            : string[],
    enabled             : boolean
}

export type SalonEmployeesResponse = SalonEmployee [];

