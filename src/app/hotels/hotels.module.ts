import { NgModule } from '@angular/core';
import { SharedModule } from '../core/shared/shared.module';

import { HotelsRoutingModule } from './hotels-routing.module';
import { HotelListComponent } from './hotel-list/hotel-list.component';

@NgModule({
  declarations: [HotelListComponent],
  imports: [
    SharedModule,
    HotelsRoutingModule
  ]
})
export class HotelsModule { }
