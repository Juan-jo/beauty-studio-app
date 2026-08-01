import { Router, Routes } from '@angular/router';
import { getHomeRouteForRole, roleGuard } from './core/guards/role.guard';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [

    {
        path: '',
        pathMatch: 'full',
        canActivate: [
          () => {
            const auth = inject(AuthService);
            const router = inject(Router);
            return router.createUrlTree([getHomeRouteForRole(auth.getRoles())]);
          }
        ],
        children: []
      },

    // Rutas PUBLIC
    {
        path: 'public',
        canActivate: [publicGuard],
        loadComponent: () => import('./layouts/public-layout/public-layout.layout').then(c => c.PublicLayoutLayout),
        children: [
            {
                path: '',
                loadComponent: () => import('./shared/pages/home/home')
                    .then(c => c.Home)
            },

            {
                path: 'services',
                loadComponent: () => import('./features/services/pages/services/services')
                    .then(c => c.Services)
            },


            {
                path: 'login',
                loadComponent: () =>
                    import('./features/auth/pages/login/login')
                        .then(c => c.Login)
            },

        ]
    },

    {
        path: 'public/booking/:serviceId',
                loadComponent: () =>
                    import('./features/booking/page/booking/booking')
                        .then(c => c.Booking)
    },


    // Rutas EMPLOYEE
    {
        path: 'employee',
        canActivate: [roleGuard],
        loadComponent: () => import('./layouts/employee-layout/employee-layout.layout').then(c => c.EmployeeLayoutLayout),
        data: { roles: ['EMPLOYEE'] },
        children: [
            {
                path: 'agenda',
                loadComponent: () => import('./features/employee/empl-agenda/empl-agenda').then(c => c.EmplAgenda)
            },

            {
                path: 'profile',
                loadComponent: () => import('./features/employee/empl-profile/empl-profile').then(c => c.EmplProfile)
            },
            {
                path: 'notifications',
                loadComponent: () => import('./features/employee/empl-notification/empl-notification').then(c => c.EmplNotification)
            }
        ]
    },
    {
        path: 'employee/schedule',
        canActivate: [roleGuard],
        loadComponent: () => import('./features/employee/empl-schedule/empl-schedule').then(c => c.EmplSchedule),
        data: { roles: ['EMPLOYEE'] },
    },
    {
        path: 'employee/booking/:serviceId',
                loadComponent: () =>
                    import('./features/booking/page/booking/booking')
                        .then(c => c.Booking)
    },


    // Rutas CUSTOMER
    {
        path: 'customer',
        canActivate: [roleGuard],
        loadComponent: () => import('./layouts/customer-layout/customer-layout.layout').then(c => c.CustomerLayoutLayout),
        data: { roles: ['CUSTOMER'] },
        children: [
            {
                path: 'feed',
                loadComponent: () => import('./features/customer/cus-feed/cus-feed').then(c => c.CusFeed)
            },

            {
                path: 'profile',
                loadComponent: () => import('./features/customer/cus-profile/cus-profile').then(c => c.CusProfile)
            }
        ]
    },

    {
        canActivate: [roleGuard],
        data: { roles: ['CUSTOMER'] },
        path: 'customer/booking/:serviceId',
                loadComponent: () =>
                    import('./features/booking/page/booking/booking')
                        .then(c => c.Booking)
    },

    





    {
        path: '**',
        redirectTo: ''
    }

];