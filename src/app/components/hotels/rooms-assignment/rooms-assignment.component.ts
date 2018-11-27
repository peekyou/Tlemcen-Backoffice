import { Component, OnInit, Input } from '@angular/core';
import { DndDropEvent } from "ngx-drag-drop";
import { DragulaService } from 'ng2-dragula';

import { Customer } from '../../../customers/customer.model';
import { Hotel } from '../../../hotels/hotel.model';

@Component({
  selector: 'app-rooms-assignment',
  templateUrl: './rooms-assignment.component.html',
  styleUrls: ['./rooms-assignment.component.scss']
})
export class RoomsAssignmentComponent implements OnInit {
  @Input() customers: Customer[];
  @Input() hotels: Hotel[];
  customersExpanded: boolean = true;

  constructor(private dragulaService: DragulaService) { 
    if (!dragulaService.find('ROOMS')) {
      dragulaService.createGroup('ROOMS', {
        accepts: (el, target, source, sibling) => {
          return this.dropAllowed(target.id);
        }
      });
    }
  } 

  ngOnInit() {
  }

  save() {
    console.log(this.customers);
    console.log(this.hotels);
  }

  onCustomerMoved(type, el, target, source, item, sourceModel, targetModel, sourceIndex, targetIndex) {
    console.log(type);
    console.log(el);
    console.log(target);
    console.log(source);
    console.log(item);
    console.log(sourceModel);
    console.log(targetModel);
    console.log(sourceIndex);
    console.log(targetIndex);
  }

  dropAllowed(id: string): boolean {
    var parts = id.split('-');
    if (parts.length == 3) {
      var hotelId = parts[0];
      var roomId = parts[1];
      var limit = parseInt(parts[2]);
      var hotel = this.hotels.find(x => x.id == hotelId);
      if (hotel && hotel.rooms && hotel.rooms.length > 0) {
        var room = hotel.rooms.find(x => x.id == roomId);
        if (room && room.customers) {
          return room.customers.length < limit;
        }  
      }
    }
    return true;
  }
}
