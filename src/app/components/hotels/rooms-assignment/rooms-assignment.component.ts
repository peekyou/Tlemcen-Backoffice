import { Component, OnInit, Input } from '@angular/core';
import { DndDropEvent } from "ngx-drag-drop";
import { DragulaService } from 'ng2-dragula';

import { Customer } from '../../../customers/customer.model';
import { TravelService } from '../../../travels/travel.service';
import { HotelReservation } from '../../../hotels/hotel-reservation.model';
import { LookupService } from '../../../core/services/lookup.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { ToasterType } from '../../../core/models/toaster-type';
import { Lookup } from '../../../core/models/lookup.model';
import { groupByArray, removeFromArrayByProperty, removeFromArray, getHajjOmraCityIdFromName } from '../../../core/helpers/utils';

@Component({
  selector: 'app-rooms-assignment',
  templateUrl: './rooms-assignment.component.html',
  styleUrls: ['./rooms-assignment.component.scss']
})
export class RoomsAssignmentComponent implements OnInit {
  mekkaHotelBookings: HotelReservation[] = [];
  medinaHotelBookings: HotelReservation[] = [];
  displayedHotelBookings: HotelReservation[];
  selectedCity: string = '1';

  @Input() hotelBookings: HotelReservation[];
  @Input() travelId: string;

  customers: any = {};
  customersExpanded: boolean = true;

  constructor(
    private dragulaService: DragulaService,
    private travelService: TravelService,
    public toasterService: ToasterService,
    private lookupService: LookupService) { 


    if (!dragulaService.find('ROOMS')) {
      dragulaService.createGroup('ROOMS', {
        accepts: (el, target, source, sibling) => {
          return this.dropAllowed(target.id);
        }
      });
    }
  }

  ngOnInit() {
    this.travelService.getTravelersWithoutHotelBooking(this.travelId)
    .subscribe(res => {
      res.forEach(el => {
        var cityId = getHajjOmraCityIdFromName(el.city);
        this.customers[cityId] = JSON.parse(JSON.stringify(el.customers));
      });
      // this.customers = {
      //   '1': JSON.parse(JSON.stringify(res.customers)),
      //   '2': JSON.parse(JSON.stringify(res.customers)),
      // };
    });

    this.lookupService.fetchCities('sa').subscribe(res => {
      this.hotelBookings.forEach(booking => {
        booking.hotel.expanded = true;
        if (booking.hotel.address && booking.hotel.address.city) {
          var lookup = res.find(y => y.name == booking.hotel.address.city);
          if (lookup && lookup.id == '1') {
            this.mekkaHotelBookings.push(booking);
          }
          else if (lookup && lookup.id == '2') {
            this.medinaHotelBookings.push(booking);
          }
        }
      });
      this.displayedHotelBookings = this.mekkaHotelBookings;
    });
  }

  save() {
    this.travelService.saveHotelsPlan(this.travelId, this.medinaHotelBookings.concat(this.mekkaHotelBookings))
      .subscribe(res => {
        if (res === true) {
          this.toasterService.showToaster('Plan de chambre sauvegardé', ToasterType.Success);
        }
      });
  }

  generate() {
    var men: Customer[] = [];
    var women: Customer[] = [];
    for (let i = 0; this.customers[this.selectedCity] && i < this.customers[this.selectedCity].length; i++) {
      var customer = this.customers[this.selectedCity][i];
      if (customer.gender == 'M') {
        men.push(customer);
      }
      else {
        women.push(customer);
      }
    }

    men = men.sort((a,b) => new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime());
    women = women.sort((a,b) => new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime());

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

  changeCity(id: string) {
    this.selectedCity = id;
    if (id == '1') {
      this.displayedHotelBookings = this.mekkaHotelBookings;
    }
    else {
      this.displayedHotelBookings = this.medinaHotelBookings;
    }
  }

  dropAllowed(id: string): boolean {
    var parts = id.split('-');
    if (parts.length == 3) {
      var reservationId = parts[0];
      var roomId = parts[1];
      var limit = parseInt(parts[2]);
      var reservation = this.mekkaHotelBookings.find(x => x.id == reservationId);
      if (!reservation) {
        reservation = this.medinaHotelBookings.find(x => x.id == reservationId);
      }
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
	  var remainingGroups = [];
	  
    while (group.length > 0) {
      var peopleToAssign = group.shift();
      var isPlaced = false;
      var bookings = this.mekkaHotelBookings;
      if (this.selectedCity == '2') {
        bookings = this.medinaHotelBookings;
      }
			
      for (let i = 0; !isPlaced && bookings && i < bookings.length; i++) {
        var hotel = bookings[i];
        for (let j = 0; !isPlaced && hotel.rooms && j < hotel.rooms.length; j++) {
          var room = hotel.rooms[j];
          
          if (!room.customers) {
            room.customers = [];
          }

          // Check if there is no one of the opposite gender in the room
          var canAssign = room.customers.find(c => c.gender != peopleToAssign.values[0].gender) == null;
          
          // Check if there is enough space for people of same name
          var remainingPlaces = room.roomType.personNumber - room.customers.length;
          canAssign = canAssign && remainingPlaces >= peopleToAssign.values.length;
          if (canAssign) {
            peopleToAssign.values.forEach(c => {
              room.customers.push(c);
              this.customers[this.selectedCity] = removeFromArray(this.customers[this.selectedCity], c);
            });
            isPlaced = true;
          }
          else {
            // Repush the men which has not been assigned
            //group.unshift(peopleToAssign);
            //break;
          }
        }
      }
	  
      if (!isPlaced) {
        remainingGroups.push(peopleToAssign);
      }
    }
	
    // Place the people in remaining groups, one by one
    // We should get the rooms with more space first
    remainingGroups.forEach(group => {
      group.values.forEach(customer => {
      
        var isPlaced = false;
        for (let i = 0; !isPlaced && bookings && i < bookings.length; i++) {
          var hotel = bookings[i];
          for (let j = 0; !isPlaced && hotel.rooms && j < hotel.rooms.length; j++) {
            var room = hotel.rooms[j];
          
            // Check if there is no one of the opposite gender in the room
            var canAssign = room.customers.find(c => c.gender != peopleToAssign.values[0].gender) == null;
            var remainingPlaces = room.roomType.personNumber - room.customers.length;
            canAssign = canAssign && remainingPlaces >= 1;
            if (canAssign) {
              room.customers.push(customer);
              this.customers[this.selectedCity] = removeFromArray(this.customers[this.selectedCity], customer);
              isPlaced = true;
            }
          }
        }
      });
    });
  }
}
