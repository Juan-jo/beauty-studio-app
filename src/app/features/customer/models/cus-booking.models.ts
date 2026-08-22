import { BookingStatus } from "../../booking/models/booking-status.model"


export interface CustomerBookingPaged {
    
    view : string
    content: CustomerBooking[]
    isLast: boolean
    totalElements: number

}

export interface CustomerBooking {

    id                  : number
    service             : string[]
    date                : string
    price               : number
    duration            : number
    status              : BookingStatus
    
    professional        : {
        name            : string,
        pictureUrl      : string
    },
}

export type ResponseCustommerBooking = CustomerBookingPaged