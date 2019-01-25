import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { RoleGuard } from '../../core/guards/role.guard';
import { AuthGuard } from '../../core/guards/auth.guard';
import { Roles } from '../../core/helpers/roles';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent, data: { roles: [Roles.Hajj, Roles.Admin] }, canActivate: [AuthGuard, RoleGuard] },
    { path: 'hajj',           loadChildren: '../../hajj/hajj.module#HajjModule', data: { roles: [Roles.Hajj, Roles.Admin] }, canActivate: [AuthGuard, RoleGuard] },
    { path: 'omra',           loadChildren: '../../omra/omra.module#OmraModule', data: { roles: [Roles.Omra, Roles.Admin] }, canActivate: [AuthGuard, RoleGuard] },
    { path: 'customers',      loadChildren: '../../customers/customers.module#CustomersModule', data: { roles: [Roles.Customers, Roles.Admin] }, canActivate: [AuthGuard, RoleGuard] },
    { path: 'hotels',         loadChildren: '../../hotels/hotels.module#HotelsModule', data: { roles: [Roles.Hotels, Roles.Admin] }, canActivate: [AuthGuard, RoleGuard] },
    { path: 'airlines',       loadChildren: '../../airlines/airlines.module#AirlinesModule', data: { roles: [Roles.Airlines, Roles.Admin] }, canActivate: [AuthGuard, RoleGuard] },
    { path: 'payments',       loadChildren: '../../payments/payments.module#PaymentsModule', data: { roles: [Roles.Payments, Roles.Admin] }, canActivate: [AuthGuard, RoleGuard] },
    { path: 'communication',  loadChildren: '../../communication/communication.module#CommunicationModule', data: { roles: [Roles.Communication, Roles.Admin] }, canActivate: [AuthGuard, RoleGuard] },
    { path: 'management',     loadChildren: '../../management/management.module#ManagementModule', data: { roles: [Roles.DocumentsManagement, Roles.UserManagement, Roles.FeesManagement, Roles.Admin] }, canActivate: [AuthGuard, RoleGuard] }
];
