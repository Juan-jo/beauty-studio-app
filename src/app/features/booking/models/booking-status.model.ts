
export type BookingStatus = 'PENDING'
    | 'CONFIRMED'
    | 'IN_PROGRESS'
    | 'CANCELLED'
    | 'COMPLETED'
    | 'NO_SHOW'



export interface StatusConfig {
    label: string;
    classes: string;
    barBg: string;     // Para la barra lateral/acento
}


export const BOOKING_STATUS_CONFIG: Record<BookingStatus, StatusConfig> = {

    'CONFIRMED': {
        label: 'Confirmado',
        classes: 'bg-emerald-50 text-emerald-800 border-emerald-100',
        barBg: 'bg-emerald-600'
    },

    'PENDING': {
        label: 'Pendiente',
        classes: 'bg-amber-50 text-amber-800 border-amber-100',
        barBg: 'bg-amber-500'
    },

    'IN_PROGRESS': {
        label: 'En Progreso',
        classes: 'bg-brand-50 text-brand-700 border-brand-100',
        barBg: 'bg-brand-600'
    },

    'COMPLETED': {
        label: 'Completado',
        classes: 'bg-slate-100 text-slate-800 border-slate-100',
        barBg: 'bg-slate-500'
    },

    'CANCELLED': {
        label: 'Cancelado',
        classes: 'bg-red-50/40 text-red-700 border-red-100',
        barBg: 'bg-red-600'
    },
    
    'NO_SHOW': {
        label: 'No asistió',
        classes: 'bg-purple-50 text-purple-800 border-purple-100',
        barBg: 'bg-purple-600'
    }
};


export function getBookingStatusClasses(status: BookingStatus): string {
    return BOOKING_STATUS_CONFIG[status]?.classes || 'bg-gray-50 text-gray-800 border-gray-500';
  }
  
  export function getBookingStatusLabel(status: BookingStatus): string {
    return BOOKING_STATUS_CONFIG[status]?.label || status;
  }


  export function getBookingStatusBarBg(status: BookingStatus): string {
    return BOOKING_STATUS_CONFIG[status]?.barBg || 'bg-white';
  }
