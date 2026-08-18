
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
        label: 'Pendiente por confirmar',
        classes: 'bg-amber-50 text-amber-800 border-amber-100',
        barBg: 'bg-amber-500'
    },

    'IN_PROGRESS': {
        label: 'En Curso',
        classes: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        barBg: 'bg-indigo-600'
    },

    'COMPLETED': {
        label: 'Completado',
        classes: 'bg-slate-100 text-slate-800 border-slate-100',
        barBg: 'bg-slate-500'
    },

    'CANCELLED': {
        label: 'Cancelado',
        classes: 'bg-rose-50/40 text-rose-700 border-rose-100',
        barBg: 'bg-rose-600'
    },

    'NO_SHOW': {
        label: 'No asistió',
        classes: 'bg-rose-50 text-rose-800 border-rose-100',
        barBg: 'bg-rose-600'
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
