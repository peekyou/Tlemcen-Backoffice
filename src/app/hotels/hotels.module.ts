import { NgModule } from '@angular/core';
import { SharedModule } from '../core/shared/shared.module';

import { HotelsRoutingModule } from './hotels-routing.module';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { HotelDialogComponent } from './hotel-dialog/hotel-dialog.component';

@NgModule({
  declarations: [HotelListComponent, HotelDialogComponent],
  imports: [
    SharedModule,
    HotelsRoutingModule
  ],
  entryComponents: [HotelDialogComponent]
})
export class HotelsModule { }
