import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        loadComponent: () =>
            import('./features/home/pages/home/home')
                .then(c => c.Home)
    },

    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/pages/login/login')
                .then(c => c.Login)
    },

    {
        path: 'services',
        loadComponent: () =>
            import('./features/services/pages/services/services')
                .then(c => c.Services)
    },

    {
        path: 'booking/:serviceId',
        loadComponent: () =>
            import('./features/booking/page/booking/booking')
                .then(c => c.Booking)
    },

    {
        path: '**',
        redirectTo: ''
    }

];