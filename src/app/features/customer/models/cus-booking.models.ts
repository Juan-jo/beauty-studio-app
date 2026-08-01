import { BookingStatus } from "../../booking/models/booking-status.model"

export interface CustomerBookingActive {

    id                  : number
    service             : string
    date                : string
    price               : number
    duration            : number
    status              : BookingStatus
    
    professional        : {
        name            : string,
        pictureUrl      : string
    },
}

export type ResponseCustommerBooking = CustomerBookingActive []