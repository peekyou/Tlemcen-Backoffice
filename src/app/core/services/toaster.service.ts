import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ToasterService {

    constructor(private snackBar: MatSnackBar) {
    }

    showToaster(message: string, success: boolean = true) {
        var bgColor = success ? 'bg-success' : 'bg-danger';
        this.snackBar.open(message, '×', {
            duration: 200000,
            panelClass: [bgColor, 'text-white']
        });
    }
}