import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { OmraComponent } from '../../omra/omra.component';
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
    { path: 'omra',           component: OmraComponent },
    { path: 'customers',      loadChildren: '../../customers/customers.module#CustomersModule' },
    { path: 'hotels',         loadChildren: '../../hotels/hotels.module#HotelsModule' },
    { path: 'airlines',       loadChildren: '../../airlines/airlines.module#AirlinesModule' },
    { path: 'payment ',       loadChildren: '../../payments/payments.module#PaymentsModule' },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
];
