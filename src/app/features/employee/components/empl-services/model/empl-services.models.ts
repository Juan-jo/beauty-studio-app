
export interface EmplServiceItem {
    id: number,
    name: string
    description: string
    price: string
    duration: number
    enabled: boolean
    pictureUrl: string
}


export type EmplServiceResponse = EmplServiceItem[];