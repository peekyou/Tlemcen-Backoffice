import { Component, OnInit, Input } from '@angular/core';
import { DndDropEvent } from "ngx-drag-drop";
import { DragulaService } from 'ng2-dragula';

import { Customer } from '../../../customers/customer.model';
import { HotelReservation } from '../../../hotels/hotel-reservation.model';
import { groupByArray, removeFromArrayByProperty, removeFromArray } from '../../../core/helpers/utils';

@Component({
  selector: 'app-rooms-assignment',
  templateUrl: './rooms-assignment.component.html',
  styleUrls: ['./rooms-assignment.component.scss']
})
export class RoomsAssignmentComponent implements OnInit {
  @Input() customers: Customer[];
  @Input() hotelReservations: HotelReservation[];
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
  }

  generate() {
    var men: Customer[] = [];
    var women: Customer[] = [];
    for (let i = 0; this.customers && i < this.customers.length; i++) {
      var customer = this.customers[i];
      if (customer.gender == 'M') {
        men.push(customer);
      }
      else {
        women.push(customer);
      }
    }

    men = men.sort((a,b) => a.birthdate.getTime() - b.birthdate.getTime());
    women = women.sort((a,b) => a.birthdate.getTime() - b.birthdate.getTime());

    var menByLastName: any[] = groupByArray(men, 'lastname');
    var womenByLastName: any[] = groupByArray(women, 'lastname');
    this.assignGroup(menByLastName);
    this.assignGroup(womenByLastName);
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
      var reservationId = parts[0];
      var roomId = parts[1];
      var limit = parseInt(parts[2]);
      var reservation = this.hotelReservations.find(x => x.id == reservationId);
      if (reservation && reservation.rooms && reservation.rooms.length > 0) {
        var room = reservation.rooms.find(x => x.id == roomId);
        if (room && room.customers) {
          return room.customers.length < limit;
        }  
      }
    }
    return true;
  }

  private assignGroup(group) {
    for (let k = 0; this.hotelReservations && k < this.hotelReservations.length; k++) {
      var hotel = this.hotelReservations[k];
      for (let l = 0; hotel.rooms && l < hotel.rooms.length; l++) {
        var room = hotel.rooms[l];
        
        if (!room.customers) {
          room.customers = [];
        }

        while (group.length > 0) {
          var peopleToAssign = group.pop();

          // Check if there is no one of the opposite gender in the room
          var canAssign = room.customers.length == 0 || room.customers.find(c => c.gender != peopleToAssign.values[0].gender) == null;
          
          // Check if there is enough space for people of same name
          var remainingPlaces = room.roomDetail.personsNumber - room.customers.length;
          canAssign = canAssign && remainingPlaces >= peopleToAssign.values.length;
          if (canAssign) {
            peopleToAssign.values.forEach(c => {
              room.customers.push(c);
              this.customers = removeFromArray(this.customers, c);
            });
          }
          else {
            // Repush the men which has not been assigned
            group.push(peopleToAssign);
            break;
          }
        }
      }
    }
  }

  private hasOppositeSex(customers: Customer[], gender: string): boolean {
    if (!customers) {
      return false;
    }
    return customers.find(c => c.gender == gender) != null;
  }
}
