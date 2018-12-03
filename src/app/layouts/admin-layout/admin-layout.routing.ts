import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'hajj',           loadChildren: '../../hajj/hajj.module#HajjModule' },
    { path: 'omra',           loadChildren: '../../omra/omra.module#OmraModule' },
    { path: 'customers',      loadChildren: '../../customers/customers.module#CustomersModule' },
    { path: 'hotels',         loadChildren: '../../hotels/hotels.module#HotelsModule' },
    { path: 'airlines',       loadChildren: '../../airlines/airlines.module#AirlinesModule' },
    { path: 'payments',       loadChildren: '../../payments/payments.module#PaymentsModule' },
    { path: 'communication',  loadChildren: '../../communication/communication.module#CommunicationModule' },
    { path: 'management',     loadChildren: '../../management/management.module#ManagementModule' },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
];
