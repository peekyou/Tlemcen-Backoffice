import { Component, AfterViewInit, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../auth/auth.service';

@Component({
    selector: 'app-user-popover',
    templateUrl: './user-popover.component.html',
    styleUrls: ['./user-popover.component.scss']
})
export class UserPopoverComponent implements AfterViewInit {
    private parentNode: any;
    @Output() private closeEvent: EventEmitter<void> = new EventEmitter();
   
     constructor(private _element: ElementRef, public user: AuthService) { 
    }
   
    ngAfterViewInit(): void {
        this.parentNode = this._element.nativeElement.parentNode;
    }
   
    @HostListener('document:click', ['$event.path'])
    onClickOutside($event: Array<any>) {
        const elementRefInPath = $event.find(node => node === this.parentNode);
        if (!elementRefInPath) {
            this.closeEvent.emit();
        }
    }

    close() {
        this.closeEvent.emit();
    }

    logout() {
        this.close();
        this.user.logout();
    }
}