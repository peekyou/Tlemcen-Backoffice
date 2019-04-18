import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import { Customer } from '../../../customers/customer.model';
import { TravelService } from '../../../travels/travel.service';
import { HotelReservation } from '../../../hotels/hotel-reservation.model';
import { HotelsService } from '../../../hotels/hotels.service';
import { LookupService } from '../../../core/services/lookup.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { ToasterType } from '../../../core/models/toaster-type';
import { Lookup } from '../../../core/models/lookup.model';
import { HotelRoomsDialogComponent } from '../../hotels/hotel-rooms-dialog/hotel-rooms-dialog.component';
import { groupByArray, removeFromArrayByProperty, removeFromArray, getHajjOmraCityIdFromName } from '../../../core/helpers/utils';

@Component({
  selector: 'app-rooms-assignment',
  templateUrl: './rooms-assignment.component.html',
  styleUrls: ['./rooms-assignment.component.scss']
})
export class RoomsAssignmentComponent implements OnInit, AfterViewInit {
  selectedBooking: HotelReservation;
  groupedRoomByHotelBooking = {};
  isEdit = false;
  loader: Subscription;

  @Input() hotelBookings: HotelReservation[];
  @Input() travelId: string;

  customers: any = {};
  customersExpanded: boolean = true;

  constructor(
    private dragulaService: DragulaService,
    private travelService: TravelService,
    private hotelService: HotelsService,
    private dialog: MatDialog, 
    public toasterService: ToasterService,
    private lookupService: LookupService) { 


    if (!dragulaService.find('ROOMS')) {
      dragulaService.createGroup('ROOMS', {
        accepts: (el, target, source, sibling) => {
          return this.dropAllowed(target.id);
        },
        moves: (el, container, handle) => {
          return this.dragAllowed(container.id);
        }
      });
    }
  }

  ngOnInit() {
    this.loader = this.travelService.getTravelersWithoutHotelBooking(this.travelId)
      .subscribe(res => {
        res.forEach(el => {
          this.customers[el.city] = JSON.parse(JSON.stringify(el.customers));
        });
        
        this.selectedBooking = this.hotelBookings[0];
        this.groupRoomByType();
      });
  }

  ngAfterViewInit() {
  }

  groupRoomByType() {
    this.hotelBookings.forEach(booking => {
      booking.hotel.expanded = true;
      this.groupBookingRoomByType(booking);
    });
  }

  groupBookingRoomByType(booking: HotelReservation) {
    var group = [];
    booking.rooms.forEach(room => {
      room.privateLabel = room.isSeparateBooking ? '(privée)' : '';

      var roomType = room.roomType.id;
      if (!group[roomType]) {
        group[roomType] = [];
      }
      group[roomType].push(room);
    });
    this.groupedRoomByHotelBooking[booking.id] = group;
  }

  openRoomReservationDialog() {
    let dialogRef = this.dialog.open(HotelRoomsDialogComponent, {
        autoFocus: false,
        width: '534px',
        data: {
          hotelReservation: this.selectedBooking,
          travelId: this.travelId
        }
    });

    dialogRef.afterClosed().subscribe((newReservation: HotelReservation) => {
      if (newReservation) {
        this.groupBookingRoomByType(newReservation);

        // Get new rooms
        newReservation.rooms.forEach(r => {
          var existing = this.selectedBooking.rooms.find(x => x.id == r.id);
          if (!existing) {
            this.selectedBooking.rooms.push(r);
          }
        });
      }
    });
  }

  deleteEmptyRooms() {
    this.hotelService.deleteEmptyRooms(this.travelId).subscribe(res => {});

    var groups = this.groupedRoomByHotelBooking[this.selectedBooking.id];
    groups.forEach(rooms => {
      for (var i = rooms.length - 1; i >= 0; --i) {
        if (!rooms[i].customers || rooms[i].customers.length == 0) {
            rooms.splice(i,1);
        }
      }
    });
  }

  save() {
    this.travelService.saveHotelsPlan(this.travelId, this.hotelBookings)
      .subscribe(res => {
        if (res === true) {
          this.toasterService.showToaster('Plan de chambre sauvegardé', ToasterType.Success);
        }
      });
  }

  generate() {
    var men: Customer[] = [];
    var women: Customer[] = [];
    for (let i = 0; this.customers[this.selectedBooking.id] && i < this.customers[this.selectedBooking.id].length; i++) {
      var customer = this.customers[this.selectedBooking.id][i];
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

  print() {
    this.travelService.downloadHotelsPlan(this.travelId).subscribe(res => {});
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

  dragAllowed(id: string): boolean {
    if (this.isEdit) return false;
    // var room = this.getRoomFromId(id);
    // if (room != null) {
    //   return !room.isSeparateBooking;
    // }
    return true;
  }

  dropAllowed(id: string): boolean {
    if (this.isEdit) return false;
    var room = this.getRoomFromId(id);
    if (room != null) {
      var limit = parseInt(id.split('-')[2]);
      if (room.customers) {
        return room.customers.length < limit// && !room.isSeparateBooking;
      }
      //return !room.isSeparateBooking;
    }
    return true;
  }

  private getRoomFromId(id: string) {
    var parts = id.split('-');
    if (parts.length == 3) {
      var reservationId = parts[0];
      var roomId = parts[1];
      var reservation = this.hotelBookings.find(x => x.id == reservationId);
      if (reservation && reservation.rooms && reservation.rooms.length > 0) {
        return reservation.rooms.find(x => x.id == roomId);
      }
    }
    return null;
  }

  private assignGroup(group) {
	  var remainingGroups = [];
	  
    while (group.length > 0) {
      var peopleToAssign = group.shift();
      var isPlaced = false;
      var hotel = this.selectedBooking;
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
            this.customers[this.selectedBooking.id] = removeFromArray(this.customers[this.selectedBooking.id], c);
          });
          isPlaced = true;
        }
        else {
          // Repush the men which has not been assigned
          //group.unshift(peopleToAssign);
          //break;
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
        var hotel = this.selectedBooking;
        for (let j = 0; !isPlaced && hotel.rooms && j < hotel.rooms.length; j++) {
          var room = hotel.rooms[j];
        
          // Check if there is no one of the opposite gender in the room
          var canAssign = room.customers.find(c => c.gender != peopleToAssign.values[0].gender) == null;
          var remainingPlaces = room.roomType.personNumber - room.customers.length;
          canAssign = canAssign && remainingPlaces >= 1;
          if (canAssign) {
            room.customers.push(customer);
            this.customers[this.selectedBooking.id] = removeFromArray(this.customers[this.selectedBooking.id], customer);
            isPlaced = true;
          }
        }
      });
    });
  }
}
