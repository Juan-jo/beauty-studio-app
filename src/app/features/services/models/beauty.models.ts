
export interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    pictureUrl: string;
}

export type ServicesResponse = Service[];