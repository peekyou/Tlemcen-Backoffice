import { Component, AfterViewInit, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';

import { AuthService } from '../../../auth/auth.service';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { DeleteDialogComponent }  from '../../common/delete-dialog/delete-dialog.component';
import { DemoService } from '../../../core/services/demo.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { ToasterType } from '../../../core/models/toaster-type';

@Component({
    selector: 'app-user-popover',
    templateUrl: './user-popover.component.html',
    styleUrls: ['./user-popover.component.scss']
})
export class UserPopoverComponent implements AfterViewInit {
    nbCustomer: number;
    private parentNode: any;
    @Output() private closeEvent: EventEmitter<void> = new EventEmitter();
   
     constructor(
         private _element: ElementRef,
         private dialog: MatDialog,
         private demoService: DemoService,
         private toasterService: ToasterService,
         public user: AuthService) { 
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

    populateDatabase() {
        this.demoService.populateCustomers(this.nbCustomer).subscribe(x => {
            this.toasterService.showToaster('Création des clients terminée', ToasterType.Success);
        });
    }

    emptyDatabase() {
        this.demoService.deleteDatabase().subscribe(x => {
            this.toasterService.showToaster('Suppression de la base de données terminée', ToasterType.Success);
        });
    }

    openConfirmationDialog() {
        let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            autoFocus: false,
            width: '534px',
            data: {
                text: 'Confirmer la création de ' + this.nbCustomer + ' clients ?'
            }
        });

        dialogRef.afterClosed().subscribe(res => {
            if (res === true) {
                this.populateDatabase();
            }
        });
    }

    openDeleteDialog() {
        let dialogRef = this.dialog.open(DeleteDialogComponent, {
            autoFocus: false,
            data: { name: 'la base de données' }
        });

        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.emptyDatabase();
            }
        });
    }
}