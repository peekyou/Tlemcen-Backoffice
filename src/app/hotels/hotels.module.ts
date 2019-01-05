import { NgModule } from '@angular/core';
import { SharedModule } from '../core/shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { StarRatingModule } from 'angular-star-rating';

import { HotelsRoutingModule } from './hotels-routing.module';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { HotelDialogComponent } from './hotel-dialog/hotel-dialog.component';

@NgModule({
  declarations: [HotelListComponent, HotelDialogComponent],
  imports: [
    SharedModule,
    ComponentsModule,
    StarRatingModule,
    HotelsRoutingModule
  ],
  entryComponents: [HotelDialogComponent]
})
export class HotelsModule { }
