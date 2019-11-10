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
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

const PROVIDERS = [
  ...APP_PROVIDERS
];

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "/assets/lang/", "-v5.json");
}

@NgModule({
  imports: [
    RouterModule,
    AppRoutingModule,
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
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent
  ],
  providers: [PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule { }
