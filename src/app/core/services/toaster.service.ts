import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { ToasterType } from '../models/toaster-type';

@Injectable()
export class ToasterService {

    constructor(private snackBar: MatSnackBar) {
    }

    showToaster(message: string, type: ToasterType = ToasterType.Success) {
        var bgColor = type == ToasterType.Warning ? 'bg-inverse' : type == ToasterType.Error ? 'bg-danger' : 'bg-success';
        this.snackBar.open(message, '×', {
            duration: 200000,
            panelClass: [bgColor, 'text-white']
        });
    }
}