import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { EmployeesComponent } from './features/employees/employees.component';


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
            }
        ]
    }
];
