
export interface EmployeeSlot {
    id: number;
    name: string;
    pictureUrl: string;
    slots: string[];
  }
  
  export interface BookingAvailbilityPayload {
    date: string;
    serviceId: number;
    duration: number;
    name: string,
    pictureUrl: string,
    price: number
    employees: EmployeeSlot[];
  }   