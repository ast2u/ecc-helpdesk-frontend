import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { EmployeesComponent } from './features/employees/employees.component';
import { TicketsComponent } from './features/tickets/tickets.component';
import { TicketDetailComponent } from './features/ticket-detail/ticket-detail.component';
import { EmployeeProfileComponent } from './features/employee-profile/employee-profile.component';
import { RolesComponent } from './features/roles/roles.component';


export const routes: Routes = [
    {
        path:'',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path:'login',
        component:LoginComponent,
        canActivate:[NoAuthGuard]
    },
    {
        path: '',
        component:LayoutComponent,
        children: [
            { path: 'dashboard',
                component: DashboardComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'employees',
                component: EmployeesComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'roles',
                component: RolesComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'tickets',
                component: TicketsComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'tickets/:id',
                component: TicketDetailComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'profile',
                component: EmployeeProfileComponent,
                canActivate: [AuthGuard]
            }
        ]
    }
];
