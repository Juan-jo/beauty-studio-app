import { BookingStatus } from "./booking-status.model";

export interface Booking {
    id: number;
    status: BookingStatus;
    startDate: string;
    endDate: string;
    durationMinutes: number;
    price: number;
    services: BookingService[];
    client: BookingClient;
    employee: BookingEmployee;
  }
  

  export interface BookingService {
    name: string;
    price: number;
  }
  
  export interface BookingClient {
    name: string;
    phone: string;
    pictureUrl: string | null;
  }
  
  export interface BookingEmployee {
    name: string;
    pictureUrl: string | null;
  }