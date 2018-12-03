import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatInputModule,
    MatRippleModule,
    MatTooltipModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatCheckboxModule,
    MatDividerModule,
    MatListModule,
    MatSelectModule,
    MatSnackBarModule,
    MAT_DATE_LOCALE
} from '@angular/material';

@NgModule({
    exports: [
        MatButtonModule,
        MatIconModule,
        MatAutocompleteModule,
        MatInputModule,
        MatRippleModule,
        MatTooltipModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatCheckboxModule,
        MatDividerModule,
        MatListModule,
        MatSelectModule,
        MatSnackBarModule,
    ],
    declarations: [],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }]
    
})
export class AppMaterialModules { }