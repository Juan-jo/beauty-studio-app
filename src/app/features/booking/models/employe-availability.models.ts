
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
    employees: EmployeeSlot[];
  }   