import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DragulaModule } from 'ng2-dragula';
import { StarRatingModule } from 'angular-star-rating';

import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { APP_PROVIDERS } from './app.providers';

import { SharedModule } from './core/shared/shared.module';
import { ComponentsModule } from './components/components.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TableListComponent } from './table-list/table-list.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { AgmCoreModule } from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

const PROVIDERS = [
  ...APP_PROVIDERS
];

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "/assets/lang/", "-v2.json");
}

@NgModule({
  imports: [
    SharedModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    DragulaModule.forRoot(),
    StarRatingModule.forRoot(),
    BrowserAnimationsModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyD2tHPV7C3ehD5O6CFPryF94GJfwj9ARoc' }),
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent
  ],
  providers: [PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule { }
